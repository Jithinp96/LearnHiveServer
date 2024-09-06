import { Student } from "../entities/Student";

export interface StudentRepository {
    save(student: Student): Promise<void>;
    findByEmail(email: string): Promise<Student | null>;
}