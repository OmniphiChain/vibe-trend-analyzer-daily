// Test the storage layer
import 'dotenv/config';
import { storage } from './server/storage.ts';

console.log('\n🔍 Testing Storage Layer...\n');

try {
  // Test getting a non-existent user
  const user = await storage.getUser(999);
  console.log('✅ Storage layer is working!');
  console.log('Test query result:', user || 'No user found (expected)');
  console.log('\n✅ Your storage layer is connected to PostgreSQL!\n');
} catch (error) {
  console.error('❌ Storage layer error:');
  console.error(error.message);
  process.exit(1);
}
