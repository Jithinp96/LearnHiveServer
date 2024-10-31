import { TutorSlotPreferenceDTO } from '../../application/dto/TutorSlotPreferenceDTO';

export interface ITutorSlotPreferenceRepository {
  saveSlotPreference(data: TutorSlotPreferenceDTO): Promise<void>;
}