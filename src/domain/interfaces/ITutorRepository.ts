import { ITutor } from "../entities/user/ITutor";

export interface ITutorRepository {
    findTutorByEmail(email: string): Promise<ITutor | null>;
    createTutor(tutor: ITutor): Promise<ITutor>;
    updateTutor(tutor:ITutor): Promise<ITutor>;
    getAllTutors(): Promise<ITutor[]>;
    findTutorById(id: string): Promise<ITutor | null>;
    updateTutorPassword(id: string, hashedPassword: string): Promise<void>;
}