import dns from 'node:dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de DNS para resolución de registros SRV de MongoDB Atlas en Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('⚠️ No se pudieron configurar servidores DNS alternativos:', e);
}

const DEFAULT_URI = 'mongodb+srv://cdandrango_db_user:zez5iXeliG7dKokW@cluster0.tjfz0to.mongodb.net/gestion_empleados?retryWrites=true&w=majority&appName=Cluster0';

export const connectDatabase = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || DEFAULT_URI;
  try {
    await mongoose.connect(uri);
    console.log('✅ [Database]: Conexión exitosa a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error crítico al conectar a la base de datos:', error);
    process.exit(1);
  }
};