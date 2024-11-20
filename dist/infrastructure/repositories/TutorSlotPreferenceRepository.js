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
exports.TutorSlotPreferenceRepository = void 0;
const TutorSlotPreferenceModel_1 = require("../database/models/TutorSlotPreferenceModel");
class TutorSlotPreferenceRepository {
    saveSlotPreference(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const preference = new TutorSlotPreferenceModel_1.TutorSlotPreferenceModel(data);
                console.log("preference from TutorSlotPreferenceRepository: ", preference);
                yield preference.save();
            }
            catch (error) {
                console.log("Error from the TutorSlotPreferenceRepository catch: ", error);
            }
        });
    }
}
exports.TutorSlotPreferenceRepository = TutorSlotPreferenceRepository;
