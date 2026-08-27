import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'bin_data' });
  
  await conn.query(`
    CREATE TABLE IF NOT EXISTS plans (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      name VARCHAR(255) NOT NULL, 
      price INT NOT NULL, 
      description VARCHAR(1000), 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  const [rows] = await conn.query('SELECT COUNT(*) as count FROM plans');
  if ((rows as any)[0].count === 0) {
    await conn.query("INSERT INTO plans (name, price, description) VALUES ('Monthly Subscription', 500, 'Full access for 1 month')");
    console.log('Inserted default plan');
  } else {
    console.log('Plans already exist');
  }
  
  await conn.end();
  console.log('Done');
}

main().catch(console.error);
