// Direct database connection test
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

console.log('\n🔍 Testing Database Connection...\n');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20) + '...\n');

try {
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);
  
  // Try a simple query
  const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
  
  console.log('✅ Database Connection Successful!\n');
  console.log('PostgreSQL Version:', result[0].pg_version.split(' ')[0] + ' ' + result[0].pg_version.split(' ')[1]);
  console.log('Current Time:', result[0].current_time);
  console.log('\n✅ Your Neon database is connected and working!\n');
  
} catch (error) {
  console.error('❌ Database Connection Failed:');
  console.error(error.message);
  process.exit(1);
}
