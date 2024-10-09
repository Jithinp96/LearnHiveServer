import { Student } from "../../../domain/entities/Student";
import { IStudentRepository } from "../../../domain/interfaces/IStudentRepository";

interface Education {
    level: string;
    board: string;
    startDate: string;
    endDate: string;
    grade: string;
    institution: string;  
}
  
// interface UpdateProfileInput {
//     studentId: string;
//     name: string;
//     email: string;
//     mobile: number;
//     profileImage?: string;
// }

export class StudentUseCase {
    constructor(private _studentRepository: IStudentRepository) {}
    
    async updateEducation(id: string, newEducationDetails: object): Promise<Student | null> {
        try {
            console.log("newEducationDetails: ", newEducationDetails);

            const validatedEducation = this.validateEducationDetails(newEducationDetails);

            const student = await this._studentRepository.findStudentById(id);
            
            if (!student) {
                throw new Error("Student not found");
            }

            student.education.push(validatedEducation);

            return await this._studentRepository.updateStudent(student);
        } catch (error) {
            console.error(error);
            throw new Error('Failed to update education');
        }
    }

    private validateEducationDetails(details: object): Education {
        const requiredFields = ['level', 'board', 'startDate', 'endDate', 'grade', 'institution'];
        const educationDetails = details as unknown;

        if (typeof educationDetails !== 'object' || educationDetails === null) {
            throw new Error('Invalid education details format');
        }

        for (const field of requiredFields) {
            if (!(field in educationDetails)) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        return educationDetails as Education;
    }
}



// // Updating general profile information
    // async updateProfile(input: UpdateProfileInput): Promise<Student | null> {
    //     try {
    //         const student = await this._studentRepository.findStudentById(input.studentId);

    //         if (!student) {
    //             throw new Error("Student not found");
    //         }

    //         // Update profile fields
    //         student.name = input.name;
    //         student.email = input.email;
    //         student.mobile = input.mobile;
    //         if (input.profileImage) {
    //             // student.profileImage = input.profileImage;
    //         }

    //         // Saving updated profile
    //         return await this._studentRepository.updateStudent(student);
    //     } catch (error) {
    //         console.error(error);
    //         throw new Error('Failed to update profile');
    //     }
    // }