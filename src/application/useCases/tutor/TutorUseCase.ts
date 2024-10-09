import { Tutor } from "../../../domain/entities/Tutor";
import { ITutorRepository } from "../../../domain/interfaces/ITutorRepository";

import { TutorEducation } from "../../../domain/entities/Tutor";
import { WorkExperience } from "../../../domain/entities/Tutor";

export class TutorUseCase {
    constructor(private _tutorRepository: ITutorRepository) {}

    async addTutorEducation(id: string, newEducationDetails: object): Promise<Tutor | null> {
        try {
            console.log("newEducationDetails: ", newEducationDetails);

            const validatedEducation = this.validateEducationDetails(newEducationDetails);

            const tutor = await this._tutorRepository.findTutorById(id);
            if(!tutor){
                throw new Error("Tutor not found");
            }

            tutor.education.push(validatedEducation)
            return await this._tutorRepository.updateTutor(tutor);
        } catch (error) {
            console.error(error);
            throw new Error('Failed to update education');
        }
    }

    private validateEducationDetails(details: object): TutorEducation {
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

        return educationDetails as TutorEducation;
    }
}