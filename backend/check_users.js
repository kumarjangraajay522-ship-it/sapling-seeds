import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const mongoURI = "mongodb://ajayk283703_db_user:PPWSb8wzJuZKGGET@ac-c7dasor-shard-00-00.uhsusji.mongodb.net:27017,ac-c7dasor-shard-00-01.uhsusji.mongodb.net:27017,ac-c7dasor-shard-00-02.uhsusji.mongodb.net:27017/?ssl=true&replicaSet=atlas-9uekf1-shard-0&authSource=admin&appName=Cluster0";

async function checkUsers() {
  try {
    await mongoose.connect(mongoURI);
    const users = await User.find({}).lean();
    console.log(`Found ${users.length} users:`);
    users.forEach(u => console.log(`- ID: ${u._id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`));
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkUsers();
