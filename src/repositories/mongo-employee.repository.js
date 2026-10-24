import { EmployeeModel } from '../models/employee.model';
export class MongoEmployeeRepository {
    mapDocumentToEntity(doc) {
        return {
            _id: doc._id.toString(),
            nombre: doc.nombre,
            cargo: doc.cargo,
            departamento: doc.departamento,
            sueldo: doc.sueldo,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }
    async findAll() {
        const docs = await EmployeeModel.find().sort({ createdAt: -1 }).exec();
        return docs.map((doc) => this.mapDocumentToEntity(doc));
    }
    async findById(id) {
        const doc = await EmployeeModel.findById(id).exec();
        if (!doc)
            return null;
        return this.mapDocumentToEntity(doc);
    }
    async create(data) {
        const newDoc = new EmployeeModel(data);
        const savedDoc = await newDoc.save();
        return this.mapDocumentToEntity(savedDoc);
    }
    async update(id, data) {
        const updatedDoc = await EmployeeModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).exec();
        if (!updatedDoc)
            return null;
        return this.mapDocumentToEntity(updatedDoc);
    }
    async delete(id) {
        const result = await EmployeeModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
}
//# sourceMappingURL=mongo-employee.repository.js.map