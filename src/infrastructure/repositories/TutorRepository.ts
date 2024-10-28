import { ITutor } from "../../domain/entities/user/ITutor";
import { ITutorRepository } from "../../domain/interfaces/ITutorRepository";
import { TutorModel } from "../database/models/TutorModel";

export class TutorRepository implements ITutorRepository {
    async createTutor(tutor: ITutor): Promise<ITutor> {
        try {
            const newTutor = new TutorModel(tutor);
            await newTutor.save();
            return newTutor.toObject();
        } catch (error) {
            console.error('Error creating tutor:', error);
            throw new Error('Failed to create tutor');
        }
    }

    async findTutorByEmail(email: string): Promise<ITutor | null> {
        try {
            return await TutorModel.findOne({ email }).lean().exec();
        } catch (error) {
            console.error('Error finding tutor by email:', error);
            throw new Error('Failed to find tutor by email');
        }
    }

    async updateTutor(tutor: ITutor): Promise<ITutor> {
        try {
            await TutorModel.updateOne({ email: tutor.email }, tutor);
            return tutor;
        } catch (error) {
            console.error('Error updating tutor:', error);
            throw new Error('Failed to update tutor');
        }
    }

    async getAllTutors(): Promise<ITutor[]> {
        try {
            const tutors = await TutorModel.find().lean().exec();
            return tutors as ITutor[];
        } catch (error) {
            console.error('Error fetching all tutors:', error);
            throw new Error('Failed to retrieve tutors');
        }
    }

    async findTutorById(id: string): Promise<ITutor | null> {
        try {
            const tutor = await TutorModel.findById(id).lean();
            return tutor as ITutor | null
        } catch (error) {
            console.error('Error finding tutor by ID:', error);
            throw new Error('Failed to find tutor by ID');
        }
    }

    async updateTutorPassword(id: string, hashedPassword: string): Promise<void> {
        try {
            await TutorModel.updateOne(
                { _id: id },
                { $set: { password: hashedPassword } }
            );
        } catch (error) {
            console.error('Error updating student password:', error);
            throw new Error('Failed to update student password');
        }
    }
}