import { Student } from "../entities/Student";

export interface StudentRepository {
    createStudent(student: Student): Promise<Student>;
    findStudentByEmail(email: string): Promise<Student | null>;
    updateStudent(student: Student): Promise<Student>;
    getAllStudents(): Promise<Student[]>;
    findStudentById(id: string): Promise<Student | null>;
}