import { ITutor } from "../../domain/entities/user/ITutor";
import { DatabaseError } from "../../domain/errors/DatabaseError";
import { TutorNotFoundError, TutorUpdateError } from "../../domain/errors/TutorError";
import { ITutorRepository } from "../../domain/interfaces/ITutorRepository";
import { TutorModel } from "../database/models/TutorModel";

export class TutorRepository implements ITutorRepository {
    async createTutor(tutor: ITutor): Promise<ITutor> {
        try {
            const newTutor = new TutorModel(tutor);
            await newTutor.save();
            return newTutor.toObject() as ITutor;
        } catch (error) {
            throw new DatabaseError();
        }
    }

    async findTutorByEmail(email: string): Promise<ITutor | null> {
        try {
            const tutor = await TutorModel.findOne({ email }).lean().exec();
            return tutor as ITutor | null;
        } catch (error) {
            throw new TutorNotFoundError();
        }
    }

    async updateTutor(tutor: ITutor): Promise<ITutor> {
        try {
            await TutorModel.updateOne({ email: tutor.email }, tutor);
            return tutor;
        } catch (error) {
            throw new TutorUpdateError();
        }
    }

    async getAllTutors(): Promise<ITutor[]> {
        try {
            const tutors = await TutorModel.find().lean().exec();
            return tutors as unknown as ITutor[];
        } catch (error) {
            throw new DatabaseError();
        }
    }

    async findTutorById(id: string): Promise<ITutor | null> {
        try {
            const tutor = await TutorModel.findById(id).lean();
            return tutor as ITutor | null
        } catch (error) {
            throw new DatabaseError();
        }
    }

    async updateTutorPassword(id: string, hashedPassword: string): Promise<void> {
        try {
            await TutorModel.updateOne(
                { _id: id },
                { $set: { password: hashedPassword } }
            );
        } catch (error) {
            throw new TutorUpdateError()
        }
    }
}