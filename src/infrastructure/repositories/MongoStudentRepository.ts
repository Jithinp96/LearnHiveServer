import { StudentRepository } from "../../domain/repositories/StudentRepository";
import { Student } from "../../domain/entities/Student";
import { StudentModel } from "../models/StudentModel";

export class MongoStudentRepository implements StudentRepository {
    async save(student: Student): Promise<void> {
        const studentDoc = new StudentModel(student)
        await studentDoc.save()
    }

    async findByEmail(email: string): Promise<Student | null> {
        const studentDoc = await StudentModel.findOne({email})
        if(!studentDoc) return null

        return new Student(
            studentDoc.id,
            studentDoc.name,
            studentDoc.email,
            studentDoc.mobile,
            studentDoc.password,
            studentDoc.createdAt
        )
    }
}