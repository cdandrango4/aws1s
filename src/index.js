import { app } from './app';
import { connectDatabase } from './config/database';
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;
const startServer = async () => {
    try {
        await connectDatabase();
        app.listen(Number(port), '0.0.0.0', () => {
            console.log(`🚀 Servidor ejecutándose en http://localhost:${port}`);
            console.log(`📡 Endpoints disponibles en http://localhost:${port}/api/v1/employees`);
        });
    }
    catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map