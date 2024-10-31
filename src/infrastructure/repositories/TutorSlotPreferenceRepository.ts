import { ITutorSlotPreferenceRepository } from '../../domain/interfaces/ITutorSlotPreferenceRepository';
import { TutorSlotPreferenceModel } from '../database/models/TutorSlotPreferenceModel';
import { TutorSlotPreferenceDTO } from '../../application/dto/TutorSlotPreferenceDTO';

export class TutorSlotPreferenceRepository implements ITutorSlotPreferenceRepository {
  async saveSlotPreference(data: TutorSlotPreferenceDTO): Promise<void> {
    try {
        const preference = new TutorSlotPreferenceModel(data);
        console.log("preference from TutorSlotPreferenceRepository: ", preference);
        
        await preference.save();
    } catch (error) {
        console.log("Error from the TutorSlotPreferenceRepository catch: ", error);
        
    }
  }
}