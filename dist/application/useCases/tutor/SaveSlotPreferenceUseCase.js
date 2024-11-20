"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveSlotPreferenceUseCase = void 0;
class SaveSlotPreferenceUseCase {
    constructor(tutorSlotPreferenceRepository) {
        this.tutorSlotPreferenceRepository = tutorSlotPreferenceRepository;
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("data from usecase: ", data);
                return this.tutorSlotPreferenceRepository.saveSlotPreference(data);
            }
            catch (error) {
                console.log("Error from the SaveSlotPreferenceUseCase catch: ", error);
            }
        });
    }
}
exports.SaveSlotPreferenceUseCase = SaveSlotPreferenceUseCase;
