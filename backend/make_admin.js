import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const mongoURI = "mongodb://ajayk283703_db_user:PPWSb8wzJuZKGGET@ac-c7dasor-shard-00-00.uhsusji.mongodb.net:27017,ac-c7dasor-shard-00-01.uhsusji.mongodb.net:27017,ac-c7dasor-shard-00-02.uhsusji.mongodb.net:27017/?ssl=true&replicaSet=atlas-9uekf1-shard-0&authSource=admin&appName=Cluster0";

async function makeAdmin() {
  const email = "ajayk283703@gmail.com";
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const result = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: 'admin' },
      { new: true }
    );

    if (result) {
      console.log(`✅ Success! User ${email} is now an ADMIN.`);
      console.log(`Updated User Data:`, { id: result._id, email: result.email, role: result.role });
    } else {
      console.log(`❌ Fail! No user found with email ${email}.`);
    }

    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

makeAdmin();
