import { StudentRepository } from "../../../domain/interfaces/StudentRepository";
import { Student } from "../../../domain/entities/Student";

export class GetStudentsList {
    private studentRepository: StudentRepository;

    constructor(studentRepository: StudentRepository) {
        this.studentRepository = studentRepository;
    }

    public async execute(): Promise<Student[]> {
        return this.studentRepository.getAllStudents();
    }
}