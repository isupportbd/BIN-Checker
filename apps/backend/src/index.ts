import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./db";
import { users, binData, plans } from "./db/schema";
import { eq, like, or, and, sql } from 'drizzle-orm';
import { sign, verify } from 'hono/jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'my-super-secret-key';

const getUserId = async (c) => {
  const authHeader = c.req.header("Authorization")?.split(" ")[1];
  if (!authHeader || authHeader === "undefined") return null;
  try {
    const payload = await verify(authHeader, JWT_SECRET);
    return payload.userId;
  } catch (e) {
    return null;
  }
};

const getAdminId = async () => {
  const firstUserRecord = await db.select({ id: users.id }).from(users).orderBy(users.id).limit(1);
  return firstUserRecord.length > 0 ? firstUserRecord[0].id : null;
};

const requireAdmin = async (c, next) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ success: false, error: "Unauthorized" }, 401);

  const adminId = await getAdminId();
  if (!adminId || adminId !== userId) {
    return c.json({ success: false, error: "Forbidden: Admin access required" }, 403);
  }
  
  await next();
};

const app = new Hono();

app.use("/*", cors());

app.get("/", (c) => {
  return c.text("BIN Management API is running!");
});

app.get("/api/check-admin", async (c) => {
  try {
    const adminRecord = await db
      .select()
      .from(users)
      .where(eq(users.isApproved, true))
      .limit(1);
    
    return c.json({ success: true, adminExists: adminRecord.length > 0 });
  } catch (error: any) {
    return c.json({ success: false, adminExists: false });
  }
});

// User Auth APIs
app.post("/api/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, password, trxId, isApproved } = body;

    const hashedPassword = await Bun.password.hash(password);

    // Check if this is the first user in the database
    const userCount = await db.select({ count: sql<number>`count(*)` }).from(users);
    const isFirstUser = userCount[0].count === 0;

    await db.insert(users).values({
      name,
      email,
      passwordHash: hashedPassword,
      trxId: trxId || null,
      isApproved: isFirstUser, // The first user is automatically approved (Admin)
    });

    return c.json({ success: true, message: "User created successfully" });
  } catch (error: any) {
    console.error(error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/api/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userRecord.length === 0) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    const user = userRecord[0];

    // Check hashed password
    let isMatch = false;
    let needsUpgrade = false;

    if (user.passwordHash.startsWith("$")) {
      isMatch = await Bun.password.verify(password, user.passwordHash);
    } else {
      // Legacy plain text check
      isMatch = user.passwordHash === password;
      if (isMatch) needsUpgrade = true;
    }

    if (!isMatch) {
      return c.json({ success: false, error: "Invalid password" }, 401);
    }

    // Upgrade legacy password to hash
    if (needsUpgrade) {
      const newHash = await Bun.password.hash(password);
      await db
        .update(users)
        .set({ passwordHash: newHash })
        .where(eq(users.id, user.id));
    }

    // Update lastLoginAt
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    const token = await sign({ userId: user.id }, JWT_SECRET);

    return c.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isApproved: user.isApproved,
      },
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Admin APIs
app.get("/api/users/pending", requireAdmin, async (c) => {
  try {
    const pendingUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        trxId: users.trxId,
        isApproved: users.isApproved,
      })
      .from(users)
      .where(eq(users.isApproved, false));
    return c.json({ success: true, data: pendingUsers });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put("/api/users/approve/:id", requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    await db
      .update(users)
      .set({ isApproved: true })
      .where(eq(users.id, id));
    return c.json({ success: true, message: "User approved" });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get("/api/users/approved", requireAdmin, async (c) => {
  try {
    const approvedUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        trxId: users.trxId,
        isApproved: users.isApproved,
        lastLoginAt: users.lastLoginAt,
      })
      .from(users)
      .where(eq(users.isApproved, true));
    return c.json({ success: true, data: approvedUsers });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/api/users/:id", requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    
    // Prevent deleting the primary admin
    const adminId = await getAdminId();
    if (id === adminId) {
      return c.json({ success: false, error: "Cannot delete the primary admin account." }, 403);
    }
    
    // Since binData has ON DELETE CASCADE, this will delete their data too
    await db.delete(users).where(eq(users.id, id));
    return c.json({ success: true, message: "User deleted" });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Plans APIs
app.get("/api/plans", requireAdmin, async (c) => {
  try {
    const allPlans = await db.select().from(plans);
    return c.json({ success: true, data: allPlans });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/api/plans", requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const { name, price, description } = body;
    
    await db.insert(plans).values({ name, price, description });
      
    return c.json({ success: true, message: "Plan created successfully" });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put("/api/plans/:id", requireAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const body = await c.req.json();
    const { name, price, description } = body;
    
    await db
      .update(plans)
      .set({ name, price, description })
      .where(eq(plans.id, id));
      
    return c.json({ success: true, message: "Plan updated successfully" });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Data Upload APIs
app.post("/api/upload", async (c) => {
  const tokenUserId = await getUserId(c);
  if (!tokenUserId) return c.json({ success: false, error: "Unauthorized" }, 401);
  try {
    const body = await c.req.json();
    const { userId, data } = body;
    const adminId = await getAdminId();
    if (userId !== tokenUserId && tokenUserId !== adminId) return c.json({ success: false, error: "Forbidden" }, 403);

    if (!userId || !data || !Array.isArray(data)) {
      return c.json({ success: false, error: "Invalid payload" }, 400);
    }
    
    // DEBUG: Log the first row to see exactly what we are receiving
    if (data.length > 0) {
      console.log("DEBUG: First row received:", data[0]);
    }

    // Helper to parse dates to standard MySQL YYYY-MM-DD
    const parseDate = (dateStr: any) => {
      if (!dateStr) return null;
      
      // Handle Excel Serial Numbers (e.g. 43726)
      if (!isNaN(Number(dateStr)) && typeof dateStr !== 'boolean') {
        const serial = Number(dateStr);
        // Excel dates are days since Dec 30, 1899
        const excelEpoch = new Date(Date.UTC(1899, 11, 30));
        const jsDate = new Date(excelEpoch.getTime() + serial * 86400000);
        return jsDate.toISOString().split('T')[0];
      }

      let d = String(dateStr).trim();
      
      // Handle standard ISO date strings (e.g. 2019-09-18T00:00:00.000Z)
      if (d.includes('T')) {
        const isoDate = new Date(d);
        if (!isNaN(isoDate.getTime())) {
          return isoDate.toISOString().split('T')[0];
        }
      }
      
      // Strip out any space-separated time components e.g. "18/09/2019 12:00:00" -> "18/09/2019"
      d = d.split(' ')[0];
      
      // Standardize separators to '/'
      d = d.replace(/[\.-]/g, '/');
      const parts = d.split('/');
      
      if (parts.length === 3) {
        let p1 = parts[0], p2 = parts[1], p3 = parts[2];
        let year, month, day;
        
        if (p1.length === 4) {
          // YYYY-MM-DD
          year = p1; month = p2; day = p3;
        } else {
          // DD/MM/YYYY or MM/DD/YYYY
          year = p3.length === 2 ? (parseInt(p3) > 50 ? '19' + p3 : '20' + p3) : p3;
          // If p2 is > 12, format MUST be MM/DD/YYYY
          if (parseInt(p2) > 12) {
            month = p1; day = p2;
          } else if (parseInt(p1) > 12) {
            day = p1; month = p2;
          } else {
            // Default to DD/MM/YYYY as requested
            day = p1; month = p2;
          }
        }
        
        const formatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        // Validate it's a real date format
        if (!isNaN(new Date(formatted).getTime())) {
          return formatted;
        }
      }
      
      // Fallback for standard JS date strings (e.g. "Wed Sep 18 2019...")
      const jsDate = new Date(dateStr);
      if (!isNaN(jsDate.getTime())) {
        return jsDate.toISOString().split('T')[0];
      }
      
      return null;
    };

    const parsedTestDate = parseDate(data[0]["BIN Issue Date"]);
    console.log("DEBUG: Parsed First Row Date:", parsedTestDate);

    const records = data.map((row: any) => ({
      userId,
      binIssueDate: parseDate(row["BIN Issue Date"]),
      circle: row["Circle"] || null,
      bin: row["BIN"] || null,
      name: row["Name"] || null,
      factoryAddress: row["Factory / Business Operation Address"] || null,
      policeStation: row["Police Station"] || null,
      mobileNumber: row["Mobile Number"] || null,
      email: row["nandi361291@gmail.com"] || row["Email"] || null,
      registeredHqAddress: row["Registered HQ Address"] || null,
      majorAreaOfEconomicActivity: row["Major Area of Economic Activity"] || null,
      areasOfManufacturing: row["Areas of Manufacturing"] || null,
      areasOfService: row["Areas of Service"] || null,
      forcedRegistration: row["Forced Registration"] || null,
    }));

    // Batch insert in chunks to avoid MySQL placeholder limits
    const chunkSize = 500;
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      await db.insert(binData).ignore().values(chunk);
    }

    return c.json({
      success: true,
      message: `Successfully processed ${records.length} records. Duplicates were ignored.`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return c.json({ success: false, error: "Failed to process upload" }, 500);
  }
});

// GET Distinct Circles
app.get("/api/circles", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ success: false, error: "Unauthorized" }, 401);

  try {
    const adminId = await getAdminId();
    let queryConditions = undefined;
    if (userId !== adminId) {
      queryConditions = eq(binData.userId, userId);
    }
    
    // MySQL distinct using Group By on circle
    const circles = await db
      .select({ circle: binData.circle })
      .from(binData)
      .where(queryConditions)
      .groupBy(binData.circle);

    return c.json({ success: true, data: circles.map(r => r.circle).filter(Boolean) });
  } catch (error) {
    console.error("Fetch circles error:", error);
    return c.json({ success: false, error: "Failed to fetch circles" }, 500);
  }
});

// GET Distinct Police Stations
app.get("/api/police-stations", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ success: false, error: "Unauthorized" }, 401);

  try {
    const adminId = await getAdminId();
    let queryConditions = undefined;
    if (userId !== adminId) {
      queryConditions = eq(binData.userId, userId);
    }
    
    const stations = await db
      .select({ policeStation: binData.policeStation })
      .from(binData)
      .where(queryConditions)
      .groupBy(binData.policeStation);

    return c.json({ success: true, data: stations.map(r => r.policeStation).filter(Boolean) });
  } catch (error) {
    console.error("Fetch police stations error:", error);
    return c.json({ success: false, error: "Failed to fetch police stations" }, 500);
  }
});

// GET Distinct Major Areas
app.get("/api/major-areas", async (c) => {
  const authHeader = c.req.header("Authorization")?.split(" ")[1];
  if (!authHeader || authHeader === 'undefined') return c.json({ success: false, error: "Unauthorized" }, 401);
  const userId = parseInt(authHeader);
  if (isNaN(userId)) return c.json({ success: false, error: "Invalid user ID" }, 401);
  const filterPoliceStation = c.req.query("policeStation") || "";
  
  try {
    let conditions = [];
    const adminId = await getAdminId();
    if (userId !== adminId) conditions.push(eq(binData.userId, userId));
    if (filterPoliceStation) conditions.push(eq(binData.policeStation, filterPoliceStation));
    
    const results = await db.select({ val: binData.majorAreaOfEconomicActivity }).from(binData).where(and(...conditions)).groupBy(binData.majorAreaOfEconomicActivity);
    return c.json({ success: true, data: results.map(r => r.val).filter(Boolean) });
  } catch (error) { return c.json({ success: false, error: "Failed" }, 500); }
});

// GET Distinct Manufacturing Areas
app.get("/api/manufacturing-areas", async (c) => {
  const authHeader = c.req.header("Authorization")?.split(" ")[1];
  if (!authHeader || authHeader === 'undefined') return c.json({ success: false, error: "Unauthorized" }, 401);
  const userId = parseInt(authHeader);
  if (isNaN(userId)) return c.json({ success: false, error: "Invalid user ID" }, 401);
  const filterPoliceStation = c.req.query("policeStation") || "";
  const filterMajorArea = c.req.query("majorArea") || "";
  
  try {
    let conditions = [];
    const adminId = await getAdminId();
    if (userId !== adminId) conditions.push(eq(binData.userId, userId));
    if (filterPoliceStation) conditions.push(eq(binData.policeStation, filterPoliceStation));
    if (filterMajorArea) conditions.push(eq(binData.majorAreaOfEconomicActivity, filterMajorArea));
    
    const results = await db.select({ val: binData.areasOfManufacturing }).from(binData).where(and(...conditions)).groupBy(binData.areasOfManufacturing);
    return c.json({ success: true, data: results.map(r => r.val).filter(Boolean) });
  } catch (error) { return c.json({ success: false, error: "Failed" }, 500); }
});

// GET Distinct Service Areas
app.get("/api/service-areas", async (c) => {
  const authHeader = c.req.header("Authorization")?.split(" ")[1];
  if (!authHeader || authHeader === 'undefined') return c.json({ success: false, error: "Unauthorized" }, 401);
  const userId = parseInt(authHeader);
  if (isNaN(userId)) return c.json({ success: false, error: "Invalid user ID" }, 401);
  const filterPoliceStation = c.req.query("policeStation") || "";
  const filterMajorArea = c.req.query("majorArea") || "";
  
  try {
    let conditions = [];
    const adminId = await getAdminId();
    if (userId !== adminId) conditions.push(eq(binData.userId, userId));
    if (filterPoliceStation) conditions.push(eq(binData.policeStation, filterPoliceStation));
    if (filterMajorArea) conditions.push(eq(binData.majorAreaOfEconomicActivity, filterMajorArea));
    
    const results = await db.select({ val: binData.areasOfService }).from(binData).where(and(...conditions)).groupBy(binData.areasOfService);
    return c.json({ success: true, data: results.map(r => r.val).filter(Boolean) });
  } catch (error) { return c.json({ success: false, error: "Failed" }, 500); }
});

// GET Itemwise Summary
app.get("/api/reports/itemwise-summary", async (c) => {
  const authHeader = c.req.header("Authorization")?.split(" ")[1];
  if (!authHeader || authHeader === 'undefined') return c.json({ success: false, error: "Unauthorized" }, 401);
  const userId = parseInt(authHeader);
  if (isNaN(userId)) return c.json({ success: false, error: "Invalid user ID" }, 401);
  
  const groupByParam = c.req.query("groupBy") || "major"; // major, manufacturing, service
  const filterCircle = c.req.query("circle") || "";
  const filterPoliceStation = c.req.query("policeStation") || "";
  
  let targetColumn = binData.majorAreaOfEconomicActivity;
  if (groupByParam === "manufacturing") targetColumn = binData.areasOfManufacturing;
  if (groupByParam === "service") targetColumn = binData.areasOfService;

  try {
    let conditions = [];
    const adminId = await getAdminId();
    if (userId !== adminId) conditions.push(eq(binData.userId, userId));
    if (filterCircle) conditions.push(eq(binData.circle, filterCircle));
    if (filterPoliceStation) conditions.push(eq(binData.policeStation, filterPoliceStation));
    
    // Ignore empty values for the grouping column
    conditions.push(sql`${targetColumn} IS NOT NULL AND ${targetColumn} != ''`);

    const results = await db
      .select({ 
        area: targetColumn, 
        count: sql<number>`count(${binData.id})` 
      })
      .from(binData)
      .where(and(...conditions))
      .groupBy(targetColumn)
      .orderBy(sql`count(${binData.id}) DESC`);

    return c.json({ success: true, data: results });
  } catch (error) { 
    console.error("Itemwise summary error:", error);
    return c.json({ success: false, error: "Failed to generate summary" }, 500); 
  }
});

// GET BIN List with Pagination & Search
app.get("/api/bins", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ success: false, error: "Unauthorized" }, 401);

  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "15");
  const search = c.req.query("search") || "";
  const filterCircle = c.req.query("circle") || "";
  const filterPoliceStation = c.req.query("policeStation") || "";
  const filterForcedReg = c.req.query("forcedRegistration") || "";
  const filterMajorArea = c.req.query("majorArea") || "";
  const filterManufacturingArea = c.req.query("manufacturingArea") || "";
  const filterServiceArea = c.req.query("serviceArea") || "";
  const offset = (page - 1) * limit;

  try {
    let conditions = [];
    const adminId = await getAdminId();
    
    // Non-admin sees only their data
    if (userId !== adminId) {
      conditions.push(eq(binData.userId, userId));
    }

    if (filterCircle) {
      conditions.push(eq(binData.circle, filterCircle));
    }
    
    if (filterPoliceStation) {
      conditions.push(eq(binData.policeStation, filterPoliceStation));
    }
    
    if (filterForcedReg && filterForcedReg !== 'All') {
      conditions.push(eq(binData.forcedRegistration, filterForcedReg));
    }
    
    if (filterMajorArea) {
      conditions.push(eq(binData.majorAreaOfEconomicActivity, filterMajorArea));
    }
    
    if (filterManufacturingArea) {
      conditions.push(eq(binData.areasOfManufacturing, filterManufacturingArea));
    }
    
    if (filterServiceArea) {
      conditions.push(eq(binData.areasOfService, filterServiceArea));
    }
    
    if (search) {
      conditions.push(
        or(
          like(binData.name, `%${search}%`),
          like(binData.bin, `%${search}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? (conditions.length === 1 ? conditions[0] : and(...conditions)) : undefined;

    const data = await db
      .select()
      .from(binData)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(sql`${binData.id} DESC`);
      
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(binData)
      .where(whereClause);

    return c.json({
      success: true,
      data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error("Fetch bins error:", error);
    return c.json({ success: false, error: "Failed to fetch data" }, 500);
  }
});

// DELETE BINs by Circle
app.delete("/api/bins/circle", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ success: false, error: "Unauthorized" }, 401);

  const circleName = c.req.query("name");
  if (!circleName) return c.json({ success: false, error: "Circle name required" }, 400);

  try {
    let conditions = [eq(binData.circle, circleName)];
    const adminId = await getAdminId();
    if (userId !== adminId) {
      conditions.push(eq(binData.userId, userId));
    }
    
    await db.delete(binData).where(and(...conditions));
    
    return c.json({ success: true, message: `Successfully deleted all data for circle: ${circleName}` });
  } catch (error) {
    console.error("Delete circle data error:", error);
    return c.json({ success: false, error: "Failed to delete data" }, 500);
  }
});

app.get("/api/transliterate", async (c) => {
  const text = c.req.query("text");
  if (!text) return c.json([]);
  
  try {
    const response = await fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=bn-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Transliteration proxy error:", error);
    return c.json({ success: false }, 500);
  }
});

// --- Helpers for Duplicate Detection ---
function levenshtein(s1: string, s2: string): number {
  if (s1 === s2) return 0;
  if (s1.length === 0) return s2.length;
  if (s2.length === 0) return s1.length;
  
  let v0 = new Array(s2.length + 1);
  let v1 = new Array(s2.length + 1);
  for (let i = 0; i <= s2.length; i++) v0[i] = i;

  for (let i = 0; i < s1.length; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < s2.length; j++) {
      const cost = s1[i] === s2[j] ? 0 : 1;
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (let j = 0; j <= s2.length; j++) v0[j] = v1[j];
  }
  return v1[s2.length];
}

function cleanString(str: string | null | undefined): string {
  if (!str) return "";
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function extractMobile(str: string | null | undefined): string {
  if (!str) return "";
  const digits = str.replace(/[^0-9]/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function areSimilar(a: string, b: string, threshold: number): boolean {
  if (!a || !b) return false;
  if (a === b) return true;
  const dist = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  return ((maxLen - dist) / maxLen) >= threshold;
}

// GET Duplicates Report
app.get("/api/reports/duplicates", async (c) => {
  const authHeader = c.req.header("Authorization")?.split(" ")[1];
  if (!authHeader || authHeader === 'undefined') return c.json({ success: false, error: "Unauthorized" }, 401);
  const userId = parseInt(authHeader);
  if (isNaN(userId)) return c.json({ success: false, error: "Invalid user ID" }, 401);
  
  const filterCircle = c.req.query("circle") || "";
  const filterPoliceStation = c.req.query("policeStation") || "";
  
  try {
    let conditions = [];
    const adminId = await getAdminId();
    if (userId !== adminId) conditions.push(eq(binData.userId, userId));
    if (filterCircle) conditions.push(eq(binData.circle, filterCircle));
    if (filterPoliceStation) conditions.push(eq(binData.policeStation, filterPoliceStation));
    
    // Fetch records to compare
    const records = await db.select().from(binData).where(conditions.length ? and(...conditions) : undefined);
    
    // Process them
    const processed = records.map(r => ({
      ...r,
      cleanName: cleanString(r.name),
      cleanAddress: cleanString(r.factoryAddress),
      cleanMobile: extractMobile(r.mobileNumber)
    }));
    
    const clusters: any[][] = [];
    const visited = new Set<number>();
    
    for (let i = 0; i < processed.length; i++) {
      if (visited.has(i)) continue;
      
      const itemA = processed[i];
      let cluster: any[] | null = null;
      
      for (let j = i + 1; j < processed.length; j++) {
        if (visited.has(j)) continue;
        
        const itemB = processed[j];
        let matchCount = 0;
        
        // 1. Mobile Match
        if (itemA.cleanMobile && itemB.cleanMobile && itemA.cleanMobile === itemB.cleanMobile) matchCount++;
        // 2. Name Match (85% similarity)
        if (itemA.cleanName && itemB.cleanName && areSimilar(itemA.cleanName, itemB.cleanName, 0.85)) matchCount++;
        // 3. Address Match (80% similarity)
        if (itemA.cleanAddress && itemB.cleanAddress && areSimilar(itemA.cleanAddress, itemB.cleanAddress, 0.80)) matchCount++;
        
        if (matchCount >= 2) {
          if (!cluster) {
            cluster = [records[i]]; // Use original record
            visited.add(i);
          }
          cluster.push(records[j]); // Use original record
          visited.add(j);
        }
      }
      
      if (cluster) {
        clusters.push(cluster);
      }
    }
    
    return c.json({ success: true, data: clusters });
  } catch (error) {
    console.error("Duplicate report error:", error);
    return c.json({ success: false, error: "Failed to generate report" }, 500);
  }
});

// Auto-approve the admin user (first user) on startup
(async () => {
  try {
    const adminId = await getAdminId();
    if (adminId) {
      await db.update(users).set({ isApproved: true }).where(eq(users.id, adminId));
      console.log(`Ensured Admin (User ID ${adminId}) is approved.`);
    }
  } catch (e) {
    console.error("Failed to auto-approve admin user:", e);
  }
})();

export default {
  port: process.env.PORT || 3002,
  fetch: app.fetch,
};
