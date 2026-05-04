import mongoose from 'mongoose';
import Order from './src/models/Order.js';
import User from './src/models/User.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const mongoURI = "mongodb://ajayk283703_db_user:PPWSb8wzJuZKGGET@ac-c7dasor-shard-00-00.uhsusji.mongodb.net:27017,ac-c7dasor-shard-00-01.uhsusji.mongodb.net:27017,ac-c7dasor-shard-00-02.uhsusji.mongodb.net:27017/?ssl=true&replicaSet=atlas-9uekf1-shard-0&authSource=admin&appName=Cluster0";

async function checkOrders() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const orders = await Order.find({}).populate('user', 'name email');
    
    if (orders.length === 0) {
      console.log('No orders found in the database.');
    } else {
      console.log(`Found ${orders.length} orders:`);
      orders.forEach(o => {
        console.log(`- ID: ${o._id}, User: ${o.user?.name} (${o.user?.email}), Status: ${o.status}, Total: ${o.totalPrice}`);
      });
    }

    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkOrders();
