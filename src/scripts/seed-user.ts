import 'dotenv/config';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import { MongoAuthRepository } from '../modules/auth/repositories/mongo-auth.repository';

// Uso: npm run seed:user -- correo@dominio.com clave123 [admin|user]
const [email = 'admin@demo.com', password = 'admin123', rol = 'admin'] = process.argv.slice(2);

const run = async (): Promise<void> => {
  await connectDatabase();
  const repo = new MongoAuthRepository();
  if (await repo.findByEmail(email)) {
    console.log(`El usuario ${email} ya existe`);
  } else {
    const hash = await bcrypt.hash(password, 10);
    await repo.createUser({ email, password: hash, rol: rol === 'user' ? 'user' : 'admin' });
    console.log(`Usuario creado: ${email} (${rol})`);
  }
  await mongoose.disconnect();
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
