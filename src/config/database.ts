import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { UserModel } from '../modules/auth/models/user.model';

dotenv.config();

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/gestion_empleados';

export const connectDatabase = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || DEFAULT_URI;
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ [Database]: Conexión exitosa a la base de datos MongoDB:', uri.replace(/\/\/.*@/, '//***@'));

    // Auto-seed usuario administrador inicial si no existe
    const adminUser = await UserModel.findOne({ email: 'admin@demo.com' });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await UserModel.create({
        email: 'admin@demo.com',
        password: hashedPassword,
        rol: 'admin'
      });
      console.log('👤 [Database]: Usuario inicial creado: admin@demo.com (admin)');
    }
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
  }
};
