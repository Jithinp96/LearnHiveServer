import { ObjectId } from "mongodb";
import { IStudent } from "../../../domain/entities/user/IStudent";
import { IStudentRepository } from "../../../domain/interfaces/IStudentRepository";
import { StudentNotFoundError, StudentUpdateError } from "../../../domain/errors/StudentError";
import { ProfileErrorEnum } from "../../../shared/enums/ErrorMessagesEnum";
import { IEducation } from "../../../domain/entities/user/IEducation";
import { IEducationWithId } from "../../../domain/entities/user/IEducation";

export class StudentUseCase {
    constructor(private _studentRepository: IStudentRepository) {}

    async getProfile(id: string): Promise<IStudent> {
        const student = await this._studentRepository.findStudentById(id);        
        if (!student) {
            throw new StudentNotFoundError();
        }
        return student;
    }

    async editProfileName(id: string, newName: string): Promise<IStudent> {
        const student = await this._studentRepository.findStudentById(id);

        if (!student) {
            throw new StudentNotFoundError();
        }

        student.name = newName;
        return await this._studentRepository.updateStudent(student);
    }

    async editMobileNumber(id: string, newMobile: number): Promise<IStudent> {
        const student = await this._studentRepository.findStudentById(id);

        if (!student) {
            throw new StudentNotFoundError();
        }

        student.mobile = newMobile;
        return await this._studentRepository.updateStudent(student);
    }

    async editProfilePic(id: string, url: string): Promise<IStudent> {
        const student = await this._studentRepository.findStudentById(id);

        if (!student) {
            throw new StudentNotFoundError();
        }

        student.profileImage = url;
        return await this._studentRepository.updateStudent(student);
    }

    async addEducation(id: string, newEducationDetails: IEducation): Promise<IStudent> {
        const validatedEducation = this.validateEducationDetails(newEducationDetails);

        const student = await this._studentRepository.findStudentById(id);

        if (!student) {
            throw new StudentNotFoundError();
        }

        student.education.push(validatedEducation);

        return await this._studentRepository.updateStudent(student);
    }

    async editEducation(studentId: string, educationId: string, educationData: Partial<IEducation>) {
        const student = await this._studentRepository.findStudentById(studentId);

        if (!student) {
            throw new StudentNotFoundError();
        }

        const educationObjectId = new ObjectId(educationId);
        const educationIndex = student.education.findIndex(
            (edu: Partial<IEducation>) => (edu as any)._id.equals(educationObjectId)
        );

        if (educationIndex === -1) {
            throw new Error(ProfileErrorEnum.EDU_NOT_FOUND);
        }

        student.education[educationIndex] = { ...student.education[educationIndex], ...educationData };

        return await this._studentRepository.updateStudent(student);
    }

    async deleteEducation(studentId: string, educationId: string) {
        const student = await this._studentRepository.findStudentById(studentId);

        if (!student) {
            throw new StudentNotFoundError();
        }

        const educationObjectId = new ObjectId(educationId);
        student.education = student.education.filter((edu: any) => {
            const educationWithId = edu as unknown as { _id: ObjectId };
            return !educationWithId._id.equals(educationObjectId);
        });

        return await this._studentRepository.updateStudent(student);
    }

    private validateEducationDetails(details: Partial<IEducation>): IEducation {
        const requiredFields = ['level', 'board', 'startDate', 'endDate', 'grade', 'institution'];
        const educationDetails = details as IEducation;

        requiredFields.forEach(field => {
            if (!(field in educationDetails)) {
                throw new Error(`Missing required field: ${field}`);
            }
        });

        return educationDetails;
    }
}
