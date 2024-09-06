import { StudentRepository } from "../../domain/repositories/StudentRepository";
import { Student } from "../../domain/entities/Student";

export class RegisterStudent {
    constructor(private studentRepo: StudentRepository) {}

    async execute(name: string, email: string, mobile: number, password: string): Promise<void> {
        const existingStudent = await this.studentRepo.findByEmail(email);
        if(existingStudent) {
            throw new Error('Email already exist')
        }

        const student = new Student(
            Math.random().toString(36).substr(2,9),
            name,
            email,
            mobile,
            password,
            new Date()
        )
        await this.studentRepo.save(student)
    }
}