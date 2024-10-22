import { ObjectId } from "mongodb";
import { Student } from "../../../domain/entities/Student";
import { IStudentRepository } from "../../../domain/interfaces/IStudentRepository";

interface Education {
    _id: string;
    level: string;
    board: string;
    startDate: string;
    endDate: string;
    grade: string;
    institution: string;  
}

export class StudentUseCase {
    constructor(
        private _studentRepository: IStudentRepository
    ) {}

    async editProfileName(id: string, newName: string): Promise<Student | null> {
        try {
            const student = await this._studentRepository.findStudentById(id);
            
            if (!student) {
                throw new Error("Student not found");
            }
            student.name = newName;
            const updatedStudent = await this._studentRepository.updateStudent(student);
            return updatedStudent;

        } catch (error) {
            console.error(error);
            throw new Error('Failed to update name');
        }
    }

    async editMobileNumber(id: string, newMobile: number): Promise<Student | null> {
        try {
            const student = await this._studentRepository.findStudentById(id);
            
            if (!student) {
                throw new Error("Student not found");
            }
            student.mobile = newMobile;
            const updatedStudent = await this._studentRepository.updateStudent(student);
            return updatedStudent;
            
        } catch (error) {
            console.error(error);
            throw new Error('Failed to update name');
        }
    }

    async editProfilePic(id: string, url: string): Promise<Student | null> {
        try {
            const student = await this._studentRepository.findStudentById(id);
            
            if (!student) {
                throw new Error("Student not found");
            }
            student.profileImage = url;
            const updatedStudent = await this._studentRepository.updateStudent(student);
            return updatedStudent;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to update profile Image');
        }
    }
    
    async addEducation(id: string, newEducationDetails: object): Promise<Student | null> {
        try {
            const validatedEducation = this.validateEducationDetails(newEducationDetails);

            const student = await this._studentRepository.findStudentById(id);
            
            if (!student) {
                throw new Error("Student not found");
            }

            student.education.push(validatedEducation);

            return await this._studentRepository.updateStudent(student);
        } catch (error) {
            console.error(error);
            throw new Error('Failed to add education');
        }
    }

    async editEducation(studentId: string, educationId: string, educationData: any) {
        
        try {
            const student = await this._studentRepository.findStudentById(studentId);
        
            if (!student) {
                throw new Error("Student not found");
            }
            const educationObjectId = new ObjectId(educationId);
            const educationIndex = student.education.findIndex(
                (edu: Partial<Education>) => (edu as any)._id.equals(educationObjectId)
            );
            
            if (educationIndex === -1) {
                throw new Error("Education record not found");
            }

            student.education[educationIndex] = { ...student.education[educationIndex], ...educationData };

            const updatedStudent = await this._studentRepository.updateStudent(student);

            return updatedStudent;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to edit education');
        }
    }

    async deleteEducation(studentId: string, educationId: string) {
        try {
            const student = await this._studentRepository.findStudentById(studentId);
            if (!student) {
                throw new Error("Student not found");
            }

            const educationObjectId = new ObjectId(educationId);

            student.education = student.education.filter((edu) => {
                const educationWithId = edu as unknown as { _id: ObjectId };
                return !educationWithId._id.equals(educationObjectId);
            });

            const updatedStudent = await this._studentRepository.updateStudent(student);

            return updatedStudent;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to delete education');
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