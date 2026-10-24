import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../app';
import { EmployeeModel } from '../models/employee.model';
// ─────────────────────────────────────────────────────────────────────────────
// 🍃 Test de Integración con MongoDB Local
// Demuestra la persistencia real contra un motor MongoDB local (127.0.0.1)
// Comparativa de latencia local (< 10ms) vs WAN Atlas Cloud (~160-900ms)
// ─────────────────────────────────────────────────────────────────────────────
describe('🍃 Integración Real: Peticiones HTTP contra MongoDB Local', () => {
    let mongoServer;
    let app;
    beforeAll(async () => {
        // Si ya existe una conexión previa de mongoose, la cerramos
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        // Inicializamos una instancia real de MongoDB local en memoria en 127.0.0.1
        mongoServer = await MongoMemoryServer.create({
            instance: {
                dbName: 'gestion_empleados_local',
            },
        });
        const localMongoUri = mongoServer.getUri();
        console.log(`\n🍃 [Local MongoDB]: Servidor local iniciado en ${localMongoUri}`);
        await mongoose.connect(localMongoUri);
        app = createApp();
    }, 60000);
    afterAll(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        if (mongoServer) {
            await mongoServer.stop();
        }
    });
    beforeEach(async () => {
        // Limpieza de colecciones entre cada prueba para asegurar determinismo
        if (mongoose.connection.readyState !== 0) {
            await EmployeeModel.deleteMany({});
        }
    });
    // ═══════════════════════════════════════════════════════════════════════════
    // 1. POST /api/v1/employees (Creación en MongoDB Local)
    // ═══════════════════════════════════════════════════════════════════════════
    it('✅ POST /api/v1/employees: Debería persistir un nuevo empleado en MongoDB local y retornar 201', async () => {
        const payload = {
            nombre: 'Lucía Fernández',
            cargo: 'Líder Técnico',
            departamento: 'Arquitectura',
            sueldo: 4800,
        };
        const startTime = performance.now();
        const res = await request(app)
            .post('/api/v1/employees')
            .send(payload)
            .expect(201);
        const duration = performance.now() - startTime;
        console.log(`   ⚡ Latencia inserción local MongoDB: ${duration.toFixed(2)} ms`);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('_id');
        expect(res.body.data.nombre).toBe(payload.nombre);
        expect(res.body.data.sueldo).toBe(payload.sueldo);
        // Verificación directa en el documento persistido en MongoDB local
        const savedInDb = await EmployeeModel.findById(res.body.data._id);
        expect(savedInDb).not.toBeNull();
        expect(savedInDb?.nombre).toBe(payload.nombre);
    });
    // ═══════════════════════════════════════════════════════════════════════════
    // 2. GET /api/v1/employees (Consulta general en MongoDB Local)
    // ═══════════════════════════════════════════════════════════════════════════
    it('✅ GET /api/v1/employees: Debería recuperar la lista de empleados guardados en MongoDB local', async () => {
        await EmployeeModel.create([
            { nombre: 'Andrés Mendoza', cargo: 'Arquitecto', departamento: 'TI', sueldo: 4200 },
            { nombre: 'Carlos Ruiz', cargo: 'DevOps Engineer', departamento: 'Cloud', sueldo: 3700 },
        ]);
        const res = await request(app)
            .get('/api/v1/employees')
            .expect(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(2);
    });
    // ═══════════════════════════════════════════════════════════════════════════
    // 3. GET /api/v1/employees/:id (Consulta por ID en MongoDB Local)
    // ═══════════════════════════════════════════════════════════════════════════
    it('✅ GET /api/v1/employees/:id: Debería recuperar el empleado por su ObjectId real', async () => {
        const emp = await EmployeeModel.create({
            nombre: 'Sofía Castro',
            cargo: 'QA Engineer',
            departamento: 'Calidad',
            sueldo: 3100,
        });
        const res = await request(app)
            .get(`/api/v1/employees/${emp._id}`)
            .expect(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.nombre).toBe('Sofía Castro');
        expect(res.body.data._id).toBe(emp._id.toString());
    });
    // ═══════════════════════════════════════════════════════════════════════════
    // 4. PUT /api/v1/employees/:id (Actualización en MongoDB Local)
    // ═══════════════════════════════════════════════════════════════════════════
    it('✅ PUT /api/v1/employees/:id: Debería actualizar un registro en MongoDB local', async () => {
        const emp = await EmployeeModel.create({
            nombre: 'David Morales',
            cargo: 'Junior Dev',
            departamento: 'TI',
            sueldo: 2000,
        });
        const updatePayload = {
            cargo: 'Semi-Senior Dev',
            sueldo: 2800,
        };
        const res = await request(app)
            .put(`/api/v1/employees/${emp._id}`)
            .send(updatePayload)
            .expect(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.cargo).toBe('Semi-Senior Dev');
        expect(res.body.data.sueldo).toBe(2800);
        // Verificar en la BD local
        const updatedInDb = await EmployeeModel.findById(emp._id);
        expect(updatedInDb?.sueldo).toBe(2800);
    });
    // ═══════════════════════════════════════════════════════════════════════════
    // 5. DELETE /api/v1/employees/:id (Eliminación en MongoDB Local)
    // ═══════════════════════════════════════════════════════════════════════════
    it('✅ DELETE /api/v1/employees/:id: Debería eliminar el registro en MongoDB local', async () => {
        const emp = await EmployeeModel.create({
            nombre: 'Empleado Temporal',
            cargo: 'Tester',
            departamento: 'QA',
            sueldo: 1500,
        });
        const res = await request(app)
            .delete(`/api/v1/employees/${emp._id}`)
            .expect(200);
        expect(res.body.success).toBe(true);
        // Verificar que ya no existe en la BD local
        const exists = await EmployeeModel.findById(emp._id);
        expect(exists).toBeNull();
    });
    // ═══════════════════════════════════════════════════════════════════════════
    // 6. Validación Perimetral Zod con MongoDB Local
    // ═══════════════════════════════════════════════════════════════════════════
    it('❌ POST /api/v1/employees: Debería rechazar payload inválido con 400 antes de insertar en Mongo', async () => {
        const invalidPayload = {
            nombre: 'Al', // < 3 caracteres
            cargo: 'Dev',
            departamento: 'TI',
            sueldo: -500, // sueldo negativo
        };
        const res = await request(app)
            .post('/api/v1/employees')
            .send(invalidPayload)
            .expect(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error.code).toBe('VALIDATION_ERROR');
        // Confirmar que nada se guardó en la base de datos local
        const count = await EmployeeModel.countDocuments();
        expect(count).toBe(0);
    });
});
//# sourceMappingURL=employee.local-mongo.spec.js.map