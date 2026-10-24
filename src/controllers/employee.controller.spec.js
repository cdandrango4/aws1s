import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { EmployeeController } from './employee.controller';
import { AppError } from '../middleware/error-handler.middleware';
// ─────────────────────────────────────────────────────────────────────────────
// 🧪 Pruebas Unitarias Aisladas — EmployeeController
// Atributo ISO/IEC 25010 evaluado: Mantenibilidad (Modularidad & Testabilidad)
//
// ✅ Ninguna importación de Mongoose — el controlador se prueba con
//    Inversión de Dependencias usando un Mock del repositorio.
// ─────────────────────────────────────────────────────────────────────────────
describe('🧪 Unit Test: EmployeeController (Mantenibilidad & Testabilidad)', () => {
    let controller;
    let mockRepository;
    let mockRequest;
    let mockResponse;
    let mockNext;
    let statusMock;
    let jsonMock;
    // Datos de prueba reutilizables
    const fakeEmployees = [
        {
            _id: '507f1f77bcf86cd799439011',
            nombre: 'Andrés Mendoza',
            cargo: 'Arquitecto de Software',
            departamento: 'TI',
            sueldo: 4000,
        },
        {
            _id: '507f1f77bcf86cd799439022',
            nombre: 'María López',
            cargo: 'Ingeniera DevOps',
            departamento: 'Infraestructura',
            sueldo: 3500,
        },
    ];
    const validCreateInput = {
        nombre: 'Carlos García',
        cargo: 'Full Stack Developer',
        departamento: 'I+D',
        sueldo: 3200,
    };
    const createdEmployee = {
        _id: '507f1f77bcf86cd799439033',
        ...validCreateInput,
    };
    beforeEach(() => {
        mockRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        controller = new EmployeeController(mockRepository);
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        mockResponse = {
            status: statusMock,
        };
        mockNext = jest.fn();
    });
    // ═══════════════════════════════════════════════════════════════════════════
    // GET ALL — findAll()
    // ═══════════════════════════════════════════════════════════════════════════
    describe('📋 getAll()', () => {
        // ✅ Caso correcto 1: Retorna lista de empleados
        it('✅ Debería retornar estado 200 y la lista completa de empleados', async () => {
            mockRepository.findAll.mockResolvedValue(fakeEmployees);
            mockRequest = {};
            await controller.getAll(mockRequest, mockResponse, mockNext);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: fakeEmployees,
            }));
            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
        });
        // ✅ Caso correcto 2: Retorna lista vacía cuando no hay empleados
        it('✅ Debería retornar estado 200 y un arreglo vacío si no existen empleados', async () => {
            mockRepository.findAll.mockResolvedValue([]);
            mockRequest = {};
            await controller.getAll(mockRequest, mockResponse, mockNext);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: [],
            }));
        });
        // ❌ Caso incorrecto 1: Error de repositorio se delega al middleware
        it('❌ Debería delegar al middleware de errores si el repositorio falla', async () => {
            const dbError = new Error('Connection timeout');
            mockRepository.findAll.mockRejectedValue(dbError);
            mockRequest = {};
            await controller.getAll(mockRequest, mockResponse, mockNext);
            expect(mockNext).toHaveBeenCalledWith(dbError);
            expect(statusMock).not.toHaveBeenCalled();
        });
        // ❌ Caso incorrecto 2: Error inesperado no controlado
        it('❌ Debería propagar excepciones no controladas al middleware next()', async () => {
            mockRepository.findAll.mockRejectedValue(new TypeError('Cannot read properties of undefined'));
            mockRequest = {};
            await controller.getAll(mockRequest, mockResponse, mockNext);
            expect(mockNext).toHaveBeenCalledWith(expect.any(TypeError));
        });
    });
    // ═══════════════════════════════════════════════════════════════════════════
    // GET BY ID — findById()
    // ═══════════════════════════════════════════════════════════════════════════
    describe('🔍 getById()', () => {
        // ✅ Caso correcto 1: Encuentra empleado por ID válido
        it('✅ Debería retornar estado 200 y el empleado encontrado por su ID', async () => {
            mockRepository.findById.mockResolvedValue(fakeEmployees[0]);
            mockRequest = { params: { id: '507f1f77bcf86cd799439011' } };
            await controller.getById(mockRequest, mockResponse, mockNext);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: fakeEmployees[0],
            }));
            expect(mockRepository.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        });
        // ✅ Caso correcto 2: Verifica que se invoca el repositorio exactamente una vez
        it('✅ Debería invocar findById del repositorio exactamente una vez', async () => {
            mockRepository.findById.mockResolvedValue(fakeEmployees[1]);
            mockRequest = { params: { id: '507f1f77bcf86cd799439022' } };
            await controller.getById(mockRequest, mockResponse, mockNext);
            expect(mockRepository.findById).toHaveBeenCalledTimes(1);
            expect(mockRepository.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439022');
        });
        // ❌ Caso incorrecto 1: ID inexistente retorna error 404
        it('❌ Debería delegar un AppError 404 si el empleado no existe', async () => {
            mockRepository.findById.mockResolvedValue(null);
            mockRequest = { params: { id: '507f1f77bcf86cd799439099' } };
            await controller.getById(mockRequest, mockResponse, mockNext);
            expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
            const errorPassed = mockNext.mock.calls[0][0];
            expect(errorPassed.statusCode).toBe(404);
        });
        // ❌ Caso incorrecto 2: Error de base de datos se propaga
        it('❌ Debería propagar un error de base de datos al middleware next()', async () => {
            const dbError = new Error('Database read error');
            mockRepository.findById.mockRejectedValue(dbError);
            mockRequest = { params: { id: '507f1f77bcf86cd799439011' } };
            await controller.getById(mockRequest, mockResponse, mockNext);
            expect(mockNext).toHaveBeenCalledWith(dbError);
        });
    });
    // ═══════════════════════════════════════════════════════════════════════════
    // CREATE — create()
    // ═══════════════════════════════════════════════════════════════════════════
    describe('➕ create()', () => {
        // ✅ Caso correcto 1: Crear empleado con datos válidos
        it('✅ Debería retornar estado 201 y el empleado creado con datos válidos', async () => {
            mockRepository.create.mockResolvedValue(createdEmployee);
            mockRequest = { body: validCreateInput };
            await controller.create(mockRequest, mockResponse, mockNext);
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: createdEmployee,
            }));
            expect(mockRepository.create).toHaveBeenCalledWith(validCreateInput);
        });
        // ✅ Caso correcto 2: Verifica el mensaje de respuesta
        it('✅ Debería retornar el mensaje de confirmación de registro exitoso', async () => {
            mockRepository.create.mockResolvedValue(createdEmployee);
            mockRequest = { body: validCreateInput };
            await controller.create(mockRequest, mockResponse, mockNext);
            expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Empleado registrado correctamente',
            }));
        });
        // ❌ Caso incorrecto 1: Fallo de repositorio al crear
        it('❌ Debería delegar al middleware de errores si el repositorio falla al crear', async () => {
            const saveError = new Error('Duplicate key violation');
            mockRepository.create.mockRejectedValue(saveError);
            mockRequest = { body: validCreateInput };
            await controller.create(mockRequest, mockResponse, mockNext);
            expect(mockNext).toHaveBeenCalledWith(saveError);
            expect(statusMock).not.toHaveBeenCalled();
        });
        // ❌ Caso incorrecto 2: Error de validación de Mongoose se propaga
        it('❌ Debería propagar un error de validación al next() sin responder directamente', async () => {
            const validationError = new Error('Validation failed');
            validationError.name = 'ValidationError';
            mockRepository.create.mockRejectedValue(validationError);
            mockRequest = { body: { nombre: '', cargo: '', departamento: '', sueldo: -1 } };
            await controller.create(mockRequest, mockResponse, mockNext);
            expect(mockNext).toHaveBeenCalledWith(validationError);
            expect(jsonMock).not.toHaveBeenCalled();
        });
    });
    // ═══════════════════════════════════════════════════════════════════════════
    // UPDATE — update()
    // ═══════════════════════════════════════════════════════════════════════════
    describe('✏️ update()', () => {
        const updateData = { sueldo: 5000 };
        const updatedEmployee = {
            ...fakeEmployees[0],
            sueldo: 5000,
        };
        // ✅ Caso correcto 1: Actualización exitosa
        it('✅ Debería retornar estado 200 y el empleado actualizado', async () => {
            mockRepository.update.mockResolvedValue(updatedEmployee);
            mockRequest = {
                params: { id: '507f1f77bcf86cd799439011' },
                body: updateData,
            };
            await controller.update(mockRequest, mockResponse, mockNext);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: updatedEmployee,
            }));
            expect(mockRepository.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateData);
        });
        // ✅ Caso correcto 2: Mensaje de actualización correcto
        it('✅ Debería retornar el mensaje de confirmación de actualización exitosa', async () => {
            mockRepository.update.mockResolvedValue(updatedEmployee);
            mockRequest = {
                params: { id: '507f1f77bcf86cd799439011' },
                body: updateData,
            };
            await controller.update(mockRequest, mockResponse, mockNext);
            expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Empleado actualizado correctamente',
            }));
        });
        // ❌ Caso incorrecto 1: Empleado no encontrado retorna 404
        it('❌ Debería delegar un AppError 404 si el empleado a actualizar no existe', async () => {
            mockRepository.update.mockResolvedValue(null);
            mockRequest = {
                params: { id: '507f1f77bcf86cd799439099' },
                body: updateData,
            };
            await controller.update(mockRequest, mockResponse, mockNext);
            expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
            const errorPassed = mockNext.mock.calls[0][0];
            expect(errorPassed.statusCode).toBe(404);
        });
        // ❌ Caso incorrecto 2: Error de repositorio se propaga
        it('❌ Debería propagar errores de repositorio durante la actualización', async () => {
            const updateError = new Error('Write concern error');
            mockRepository.update.mockRejectedValue(updateError);
            mockRequest = {
                params: { id: '507f1f77bcf86cd799439011' },
                body: updateData,
            };
            await controller.update(mockRequest, mockResponse, mockNext);
            expect(mockNext).toHaveBeenCalledWith(updateError);
        });
    });
    // ═══════════════════════════════════════════════════════════════════════════
    // DELETE — delete()
    // ═══════════════════════════════════════════════════════════════════════════
    describe('🗑️ delete()', () => {
        // ✅ Caso correcto 1: Eliminación exitosa
        it('✅ Debería retornar estado 200 al eliminar un empleado existente', async () => {
            mockRepository.delete.mockResolvedValue(true);
            mockRequest = { params: { id: '507f1f77bcf86cd799439011' } };
            await controller.delete(mockRequest, mockResponse, mockNext);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: { id: '507f1f77bcf86cd799439011' },
            }));
            expect(mockRepository.delete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        });
        // ✅ Caso correcto 2: Mensaje de eliminación correcto
        it('✅ Debería retornar el mensaje de confirmación de eliminación exitosa', async () => {
            mockRepository.delete.mockResolvedValue(true);
            mockRequest = { params: { id: '507f1f77bcf86cd799439011' } };
            await controller.delete(mockRequest, mockResponse, mockNext);
            expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Empleado eliminado correctamente',
            }));
        });
        // ❌ Caso incorrecto 1: Empleado no encontrado retorna 404
        it('❌ Debería delegar un AppError 404 si el empleado a eliminar no existe', async () => {
            mockRepository.delete.mockResolvedValue(false);
            mockRequest = { params: { id: '507f1f77bcf86cd799439099' } };
            await controller.delete(mockRequest, mockResponse, mockNext);
            expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
            const errorPassed = mockNext.mock.calls[0][0];
            expect(errorPassed.statusCode).toBe(404);
        });
        // ❌ Caso incorrecto 2: Error de repositorio se propaga
        it('❌ Debería propagar errores del repositorio durante la eliminación', async () => {
            const deleteError = new Error('Foreign key constraint violation');
            mockRepository.delete.mockRejectedValue(deleteError);
            mockRequest = { params: { id: '507f1f77bcf86cd799439011' } };
            await controller.delete(mockRequest, mockResponse, mockNext);
            expect(mockNext).toHaveBeenCalledWith(deleteError);
        });
    });
});
//# sourceMappingURL=employee.controller.spec.js.map