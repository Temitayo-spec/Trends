import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URI) return console.log('MongoDB_URI not found');

  if (isConnected) return console.log('Already connected to the DB');

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;
    console.log('Connected to DB Successfully');
  } catch (error) {}
};
