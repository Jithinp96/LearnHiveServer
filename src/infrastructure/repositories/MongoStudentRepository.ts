import { StudentRepository } from "../../domain/interfaces/StudentRepository";
import { Student } from "../../domain/entities/Student";
import { StudentModel } from "../database/models/StudentModel";

export class MongoStudentRepository implements StudentRepository {
  async createStudent(student: Student): Promise<Student> {
    const newStudent = new StudentModel(student);
    await newStudent.save();
    return newStudent.toObject() as Student;
  }

  async findStudentByEmail(email: string): Promise<Student | null> {
    const student = await StudentModel.findOne({ email }).lean().exec();
    return student as Student | null
  }

  async updateStudent(student: Student): Promise<Student> {
    await StudentModel.updateOne({ email: student.email }, student);
    return student;
  }

  async getAllStudents(): Promise<Student[]> {
    const students = await StudentModel.find().lean().exec();
    return students as Student[];
  }

  async findStudentById(id: string): Promise<Student | null> {
    const student = await StudentModel.findById(id).lean();
    return student as Student | null;
  }
}