import { Tutor } from "../entities/Tutor";

export interface ITutorRepository {
    findTutorByEmail(email: string): Promise<Tutor | null>;
    createTutor(tutor: Tutor): Promise<Tutor>;
    updateTutor(tutor:Tutor): Promise<Tutor>;
    getAllTutors(): Promise<Tutor[]>;
    findTutorById(id: string): Promise<Tutor | null>;
    updateTutorPassword(id: string, hashedPassword: string): Promise<void>;
}