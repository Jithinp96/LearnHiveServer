import { IStudentRepository } from "../../../domain/interfaces/IStudentRepository";
import { Student } from "../../../domain/entities/Student";

export class GetStudentsList {
    private _studentRepository: IStudentRepository;

    constructor(studentRepository: IStudentRepository) {
        this._studentRepository = studentRepository;
    }

    public async execute(): Promise<Student[]> {
        try {
            const students = await this._studentRepository.getAllStudents();
            return students;
        } catch (error) {
            console.error("Error fetching students list:", error);
            throw new Error("Failed to retrieve students list: " + error);
        }
    }
}