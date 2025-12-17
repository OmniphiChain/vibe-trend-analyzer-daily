// Quick test script to verify database connection
fetch('http://localhost:5000/api/health')
  .then(res => res.json())
  .then(data => {
    console.log('\n✅ Database Connection Test:');
    console.log(JSON.stringify(data, null, 2));
    console.log('\nDatabase Status:', data.database);
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ Connection test failed:', err.message);
    process.exit(1);
  });
