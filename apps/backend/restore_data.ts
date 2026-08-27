import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'bin_data' });
  
  // Clean up just in case
  await conn.query('DELETE FROM users');
  
  // Insert Admin
  const [adminResult] = await conn.query(`
    INSERT INTO users (name, email, password_hash, is_approved) 
    VALUES ('Admin User', 'admin@example.com', 'admin123', true)
  `);
  
  const adminId = (adminResult as any).insertId;

  // Insert mock bin data
  await conn.query(`
    INSERT INTO bin_data (user_id, name, bin, circle, bin_status) 
    VALUES 
    (?, 'Test Factory 1', '123456789', 'Circle A', 'Active'),
    (?, 'Test Factory 2', '987654321', 'Circle B', 'Pending')
  `, [adminId, adminId]);

  await conn.end();
  console.log('Restored mock data.');
}

main().catch(console.error);
