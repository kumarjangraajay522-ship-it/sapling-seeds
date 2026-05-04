import mongoose from 'mongoose';
import Order from './src/models/Order.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const mongoURI = "mongodb://ajayk283703_db_user:PPWSb8wzJuZKGGET@ac-c7dasor-shard-00-00.uhsusji.mongodb.net:27017,ac-c7dasor-shard-00-01.uhsusji.mongodb.net:27017,ac-c7dasor-shard-00-02.uhsusji.mongodb.net:27017/?ssl=true&replicaSet=atlas-9uekf1-shard-0&authSource=admin&appName=Cluster0";

async function checkRawOrders() {
  try {
    await mongoose.connect(mongoURI);
    const orders = await Order.find({}).lean();
    console.log(JSON.stringify(orders, null, 2));
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkRawOrders();
