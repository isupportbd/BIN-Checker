import mysql from 'mysql2/promise'; 

async function run() { 
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'bin_data' }); 
  await conn.query("INSERT INTO users (name, email, password_hash, is_approved, last_login_at) VALUES ('Inactive User', 'inactive@example.com', 'test', true, DATE_SUB(NOW(), INTERVAL 4 MONTH))"); 
  await conn.end(); 
  console.log('Created an inactive user'); 
} 
run();
