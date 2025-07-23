import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://localhost:27017/fereelab_chat';

async function testAuth() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('fereelab_chat');
    
    // Find the test user
    const user = await db.collection('users').findOne({ email: 'test@example.com' });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User found:', {
      email: user.email,
      name: user.name,
      provider: user.provider,
      isActive: user.isActive
    });
    
    // Test password
    const isPasswordValid = await bcrypt.compare('password123', user.password);
    console.log('Password valid:', isPasswordValid);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testAuth();
