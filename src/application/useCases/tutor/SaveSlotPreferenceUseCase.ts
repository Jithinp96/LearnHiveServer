import { ITutorSlotPreferenceRepository } from "../../../domain/interfaces/ITutorSlotPreferenceRepository";
import { TutorSlotPreferenceDTO } from '../../dto/TutorSlotPreferenceDTO';

export class SaveSlotPreferenceUseCase {
  constructor(private tutorSlotPreferenceRepository: ITutorSlotPreferenceRepository) {}

  async execute(data: TutorSlotPreferenceDTO) {
    try {
        console.log("data from usecase: ", data);
    
        return this.tutorSlotPreferenceRepository.saveSlotPreference(data);
    } catch (error) {
        console.log("Error from the SaveSlotPreferenceUseCase catch: ", error);
    }
  }
}