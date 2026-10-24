import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/gestion_empleados';

export const connectDatabase = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || DEFAULT_URI;
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ [Database]: Conexión exitosa a la base de datos MongoDB:', uri.replace(/\/\/.*@/, '//***@'));
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
  }
};
