import { TutorRepository } from "../../domain/interfaces/TutorRepository";
import { Tutor } from "../../domain/entities/Tutor";
import { TutorModel } from "../database/models/TutorModel";

export class MongoTutorRepository implements TutorRepository {
  async createTutor(tutor: Tutor): Promise<Tutor> {
    const newTutor = new TutorModel(tutor);
    await newTutor.save();
    return newTutor.toObject();
  }

  async findTutorByEmail(email: string): Promise<Tutor | null> {
    return TutorModel.findOne({ email }).lean().exec();
  }

  async updateTutor(tutor: Tutor): Promise<Tutor> {
    await TutorModel.updateOne({ email: tutor.email }, tutor);
    return tutor;
  }
}