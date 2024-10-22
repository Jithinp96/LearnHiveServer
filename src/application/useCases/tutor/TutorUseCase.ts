import { ObjectId } from "mongodb";
import { Tutor } from "../../../domain/entities/Tutor";
import { ITutorRepository } from "../../../domain/interfaces/ITutorRepository";

import { TutorEducation } from "../../../domain/entities/Tutor";
import { ITutorSlotRepository } from "../../../domain/interfaces/ITutorSlotRepository";
import { TutorSlot } from "../../../domain/entities/TutorSlots";

interface Education {
    _id: string;
    level: string;
    board: string;
    startDate: string;
    endDate: string;
    grade: string;
    institution: string;  
}

interface Subjects {
    name: string;
    level: string
}

interface Slot {
    _id: ObjectId;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

export class TutorUseCase {
    constructor(
        private _tutorRepository: ITutorRepository,
        private _tutorSlotRepository: ITutorSlotRepository
    ) {}

    async editProfileName(id: string, newName: string): Promise<Tutor | null> {
        try {
            const tutor = await this._tutorRepository.findTutorById(id);
            
            if (!tutor) {
                throw new Error("Tutor not found");
            }
            tutor.name = newName;
            const updatedTutor = await this._tutorRepository.updateTutor(tutor);
            return updatedTutor;

        } catch (error) {
            console.error(error);
            throw new Error('Failed to update name');
        }
    }

    async editMobileNumber(id: string, newMobile: number): Promise<Tutor | null> {
        try {
            const tutor = await this._tutorRepository.findTutorById(id);
            
            if (!tutor) {
                throw new Error("Tutor not found");
            }
            tutor.mobile = newMobile;
            const updatedTutor = await this._tutorRepository.updateTutor(tutor);
            return updatedTutor;
            
        } catch (error) {
            console.error(error);
            throw new Error('Failed to update name');
        }
    }

    async editProfilePic(id: string, url: string): Promise<Tutor | null> {
        try {
            const tutor = await this._tutorRepository.findTutorById(id);
            
            if (!tutor) {
                throw new Error("Tutor not found");
            }
            tutor.profileImage = url;
            const updatedTutor = await this._tutorRepository.updateTutor(tutor);
            return updatedTutor;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to update profile Image');
        }
    }

    async addEducation(id: string, newEducationDetails: object): Promise<Tutor | null> {
        try {
            const validatedEducation = this.validateEducationDetails(newEducationDetails);

            const tutor = await this._tutorRepository.findTutorById(id);
            
            if (!tutor) {
                throw new Error("Tutor not found");
            }

            tutor.education.push(validatedEducation);

            return await this._tutorRepository.updateTutor(tutor);
        } catch (error) {
            console.error(error);
            throw new Error('Failed to add education');
        }
    }

    async editEducation(tutorId: string, educationId: string, educationData: any) {
        
        try {
            const tutor = await this._tutorRepository.findTutorById(tutorId);
        
            if (!tutor) {
                throw new Error("Tutor not found");
            }
            const educationObjectId = new ObjectId(educationId);
            const educationIndex = tutor.education.findIndex(
                (edu: Partial<Education>) => (edu as any)._id.equals(educationObjectId)
            );
            
            if (educationIndex === -1) {
                throw new Error("Education record not found");
            }

            tutor.education[educationIndex] = { ...tutor.education[educationIndex], ...educationData };

            const updatedTutor = await this._tutorRepository.updateTutor(tutor);

            return updatedTutor;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to edit education');
        }
    }

    async deleteEducation(tutorId: string, educationId: string) {
        try {
            const tutor = await this._tutorRepository.findTutorById(tutorId);
            if (!tutor) {
                throw new Error("Tutor not found");
            }

            const educationObjectId = new ObjectId(educationId);

            tutor.education = tutor.education.filter((edu) => {
                const educationWithId = edu as unknown as { _id: ObjectId };
                return !educationWithId._id.equals(educationObjectId);
            });

            const updatedTutor = await this._tutorRepository.updateTutor(tutor);

            return updatedTutor;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to delete education');
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

    async addSubject(tutorId: string, subjectDetails: object): Promise<Tutor | null> {
        try {
            const tutor = await this._tutorRepository.findTutorById(tutorId);
            if (!tutor) {
                throw new Error("Tutor not found");
            }

            tutor.subjects.push(subjectDetails as Subjects);
            const updatedTutor = await this._tutorRepository.updateTutor(tutor);
            return updatedTutor;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to add subject');
        }
    }

    // Edit Subject
    async editSubject(tutorId: string, subjectId: string, updatedSubject: Partial<Subjects>): Promise<Tutor | null> {
        try {
            const tutor = await this._tutorRepository.findTutorById(tutorId);
            if (!tutor) {
                throw new Error("Tutor not found");
            }

            const subjectIndex = tutor.subjects.findIndex(subject => (subject as any)._id.equals(subjectId));
            if (subjectIndex === -1) {
                throw new Error("Subject not found");
            }

            tutor.subjects[subjectIndex] = { ...tutor.subjects[subjectIndex], ...updatedSubject };
            const updatedTutor = await this._tutorRepository.updateTutor(tutor);
            return updatedTutor;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to edit subject');
        }
    }

    // Delete Subject
    async deleteSubject(tutorId: string, subjectId: string): Promise<Tutor | null> {
        try {
            const tutor = await this._tutorRepository.findTutorById(tutorId);
            if (!tutor) {
                throw new Error("Tutor not found");
            }

            tutor.subjects = tutor.subjects.filter((subject: any) => !subject._id.equals(subjectId));
            const updatedTutor = await this._tutorRepository.updateTutor(tutor);
            return updatedTutor;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to delete subject');
        }
    }

    async fetchSubjects(tutorId: string): Promise<object[]> {
        try {
            const tutor = await this._tutorRepository.findTutorById(tutorId);
            if (!tutor) {
                throw new Error("Tutor not found");
            }
    
            return tutor.subjects;
    
        } catch (error) {
            console.error('Error fetching subjects:', error);
            throw new Error('Failed to fetch subjects');
        }
    }

    async addSlot(slotData: TutorSlot): Promise<TutorSlot> {
        try {
            const newSlot = await this._tutorSlotRepository.create(slotData);
            return newSlot;
        } catch (error) {
            throw new Error('Failed to create slot: ' + error);
        }
    }

    // Edit an existing tutor slot
    async editSlot(slotId: string, slotData: Partial<TutorSlot>): Promise<TutorSlot | null> {
        try {
            const updatedSlot = await this._tutorSlotRepository.update(slotId, slotData);
            if (!updatedSlot) {
                throw new Error('Slot not found');
            }
            return updatedSlot;
        } catch (error) {
            throw new Error('Failed to edit slot: ' + error);
        }
    }

    // Get a specific slot by its ID
    async getSlotById(slotId: string): Promise<TutorSlot | null> {
        try {
            const slot = await this._tutorSlotRepository.findById(slotId);
            if (!slot) {
                throw new Error('Slot not found');
            }
            return slot;
        } catch (error) {
            throw new Error('Failed to get slot: ' + error);
        }
    }

    // Get all slots for a specific tutor
    async getAllSlotsByTutorId(tutorId: string): Promise<TutorSlot[]> {
        try {
            const slots = await this._tutorSlotRepository.findAll(tutorId);
            return slots;
        } catch (error) {
            throw new Error('Failed to get slots: ' + error);
        }
    }
    
}