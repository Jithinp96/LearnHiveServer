import { Tutor } from "../entities/Tutor";

export interface TutorRepository {
    findTutorByEmail(email: string): Promise<Tutor | null>;
    createTutor(tutor: Tutor): Promise<Tutor>;
    updateTutor(tutor:Tutor): Promise<Tutor>;
}