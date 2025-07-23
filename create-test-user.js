import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://localhost:27017/fereelab_chat';

async function createTestUser() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('fereelab_chat');
    
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const testUser = {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      image: null,
      provider: 'credentials',
      providerId: null,
      emailVerified: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('users').insertOne(testUser);
    console.log('Test user created successfully!');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await client.close();
  }
}

createTestUser();
