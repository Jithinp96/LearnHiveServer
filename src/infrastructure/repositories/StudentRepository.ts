import { IStudent } from "../../domain/entities/user/IStudent";
import { DatabaseError } from "../../domain/errors/DatabaseError";
import { StudentNotFoundError, StudentUpdateError } from "../../domain/errors/StudentError";
import { IStudentRepository } from "../../domain/interfaces/IStudentRepository";
import { StudentModel } from "../database/models/StudentModel";

export class StudentRepository implements IStudentRepository {
    async createStudent(student: IStudent): Promise<IStudent> {
        try {
            const newStudent = new StudentModel(student);
            await newStudent.save();
            return newStudent.toObject() as IStudent;
        } catch (error) {
            throw new DatabaseError();
        }
    }

    async findStudentByEmail(email: string): Promise<IStudent | null> {
        try {
            const student = await StudentModel.findOne({ email }).lean().exec();
            return student as IStudent | null;
        } catch (error) {
            throw new StudentNotFoundError();
        }
    }

    async updateStudent(student: IStudent): Promise<IStudent> {
        try {
            await StudentModel.updateOne({ email: student.email }, student);
            return student as IStudent;
        } catch (error) {
            throw new StudentUpdateError();
        }
    }

    async getAllStudents(): Promise<IStudent[]> {
        try {
            const students = await StudentModel.find().lean().exec();
            return students as unknown as IStudent[];
        } catch (error) {
            throw new DatabaseError()
        }
    }

    async findStudentById(id: string): Promise<IStudent | null> {
        try {
            const student = await StudentModel.findById(id).lean();
            return student as IStudent | null;
        } catch (error) {
            throw new DatabaseError()
        }
    }

    async updateStudentPassword(id: string, hashedPassword: string): Promise<void> {
        try {
            await StudentModel.updateOne(
                { _id: id },
                { $set: { password: hashedPassword } }
            );
        } catch (error) {
            throw new StudentUpdateError()
        }
    }
}