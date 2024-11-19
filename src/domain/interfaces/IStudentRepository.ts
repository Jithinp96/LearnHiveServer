import { IStudent } from "../entities/user/IStudent";

export interface IStudentRepository {
    createStudent(student: IStudent): Promise<IStudent>;
    findStudentByEmail(email: string): Promise<IStudent | null >;
    updateStudent(student: IStudent): Promise<IStudent>;
    getAllStudents(): Promise<IStudent[]>;
    findStudentById(id: string): Promise<IStudent | null>;
    updateStudentPassword(id: string, hashedPassword: string): Promise<void>;
}