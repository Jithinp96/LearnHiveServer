import { Student } from "../../domain/entities/Student";
import { IStudentRepository } from "../../domain/interfaces/IStudentRepository";
import { StudentModel } from "../database/models/StudentModel";

export class StudentRepository implements IStudentRepository {
    async createStudent(student: Student): Promise<Student> {
        try {
            const newStudent = new StudentModel(student);
            await newStudent.save();
            return newStudent.toObject() as Student;
        } catch (error) {
            console.error('Error creating student:', error);
            throw new Error('Failed to create student');
        }
    }

    async findStudentByEmail(email: string): Promise<Student | null> {
        try {
            const student = await StudentModel.findOne({ email }).lean().exec();
            return student as Student | null;
        } catch (error) {
            console.error('Error finding student by email:', error);
            throw new Error('Failed to find student by email');
        }
    }

    async updateStudent(student: Student): Promise<Student> {
        try {
            await StudentModel.updateOne({ email: student.email }, student);
            return student as Student;
        } catch (error) {
            console.error('Error updating student:', error);
            throw new Error('Failed to update student');
        }
    }

    async getAllStudents(): Promise<Student[]> {
        try {
            const students = await StudentModel.find().lean().exec();
            return students as Student[];
        } catch (error) {
            console.error('Error fetching all students:', error);
            throw new Error('Failed to retrieve students');
        }
    }

    async findStudentById(id: string): Promise<Student | null> {
        try {
            const student = await StudentModel.findById(id).lean();
            return student as Student | null;
        } catch (error) {
            console.error('Error finding student by ID:', error);
            throw new Error('Failed to find student by ID');
        }
    }

    async updateStudentPassword(id: string, hashedPassword: string): Promise<void> {
        try {
            await StudentModel.updateOne(
                { _id: id },
                { $set: { password: hashedPassword } }
            );
        } catch (error) {
            console.error('Error updating student password:', error);
            throw new Error('Failed to update student password');
        }
    }
}