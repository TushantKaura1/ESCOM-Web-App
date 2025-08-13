// test-db.js - Test MongoDB Connection
const { connectDB, checkConnection, disconnectDB } = require('./src/mongo-api/db');

async function testConnection() {
  try {
    console.log('🧪 Testing MongoDB connection...');
    
    // Connect to database
    const db = await connectDB();
    console.log('✅ Connection successful!');
    
    // Test health check
    const isHealthy = await checkConnection();
    console.log('🏥 Health check:', isHealthy ? 'PASSED' : 'FAILED');
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('📚 Collections found:', collections.length);
    collections.forEach(col => console.log('  -', col.name));
    
    // Test a simple operation
    const testCollection = db.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    console.log('✍️ Write test: PASSED');
    
    const result = await testCollection.findOne({ test: 'connection' });
    console.log('📖 Read test:', result ? 'PASSED' : 'FAILED');
    
    // Clean up
    await testCollection.deleteOne({ test: 'connection' });
    console.log('🧹 Cleanup: PASSED');
    
    console.log('🎉 All tests passed! MongoDB is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('🔧 Make sure MongoDB is running on localhost:27017');
    console.error('💡 Start MongoDB with: brew services start mongodb-community');
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

// Run the test
testConnection(); 