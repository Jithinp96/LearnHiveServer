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
exports.TutorUseCase = void 0;
const mongodb_1 = require("mongodb");
class TutorUseCase {
    constructor(_tutorRepository, _tutorSlotRepository) {
        this._tutorRepository = _tutorRepository;
        this._tutorSlotRepository = _tutorSlotRepository;
    }
    editProfileName(id, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield this._tutorRepository.findTutorById(id);
                if (!tutor) {
                    throw new Error("Tutor not found");
                }
                tutor.name = newName;
                const updatedTutor = yield this._tutorRepository.updateTutor(tutor);
                return updatedTutor;
            }
            catch (error) {
                console.error(error);
                throw new Error('Failed to update name');
            }
        });
    }
    editMobileNumber(id, newMobile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield this._tutorRepository.findTutorById(id);
                if (!tutor) {
                    throw new Error("Tutor not found");
                }
                tutor.mobile = newMobile;
                const updatedTutor = yield this._tutorRepository.updateTutor(tutor);
                return updatedTutor;
            }
            catch (error) {
                console.error(error);
                throw new Error('Failed to update name');
            }
        });
    }
    editProfilePic(id, url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield this._tutorRepository.findTutorById(id);
                if (!tutor) {
                    throw new Error("Tutor not found");
                }
                tutor.profileImage = url;
                const updatedTutor = yield this._tutorRepository.updateTutor(tutor);
                return updatedTutor;
            }
            catch (error) {
                console.error(error);
                throw new Error('Failed to update profile Image');
            }
        });
    }
    addEducation(id, newEducationDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedEducation = this.validateEducationDetails(newEducationDetails);
                const tutor = yield this._tutorRepository.findTutorById(id);
                if (!tutor) {
                    throw new Error("Tutor not found");
                }
                tutor.education.push(validatedEducation);
                return yield this._tutorRepository.updateTutor(tutor);
            }
            catch (error) {
                console.error(error);
                throw new Error('Failed to add education');
            }
        });
    }
    editEducation(tutorId, educationId, educationData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield this._tutorRepository.findTutorById(tutorId);
                if (!tutor) {
                    throw new Error("Tutor not found");
                }
                const educationObjectId = new mongodb_1.ObjectId(educationId);
                const educationIndex = tutor.education.findIndex((edu) => edu._id.equals(educationObjectId));
                if (educationIndex === -1) {
                    throw new Error("Education record not found");
                }
                tutor.education[educationIndex] = Object.assign(Object.assign({}, tutor.education[educationIndex]), educationData);
                const updatedTutor = yield this._tutorRepository.updateTutor(tutor);
                return updatedTutor;
            }
            catch (error) {
                console.error(error);
                throw new Error('Failed to edit education');
            }
        });
    }
    deleteEducation(tutorId, educationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield this._tutorRepository.findTutorById(tutorId);
                if (!tutor) {
                    throw new Error("Tutor not found");
                }
                const educationObjectId = new mongodb_1.ObjectId(educationId);
                tutor.education = tutor.education.filter((edu) => {
                    const educationWithId = edu;
                    return !educationWithId._id.equals(educationObjectId);
                });
                const updatedTutor = yield this._tutorRepository.updateTutor(tutor);
                return updatedTutor;
            }
            catch (error) {
                console.error(error);
                throw new Error('Failed to delete education');
            }
        });
    }
    validateEducationDetails(details) {
        const requiredFields = ['level', 'board', 'startDate', 'endDate', 'grade', 'institution'];
        const educationDetails = details;
        if (typeof educationDetails !== 'object' || educationDetails === null) {
            throw new Error('Invalid education details format');
        }
        for (const field of requiredFields) {
            if (!(field in educationDetails)) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        return educationDetails;
    }
    addSubject(tutorId, subjectDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield this._tutorRepository.findTutorById(tutorId);
                if (!tutor) {
                    throw new Error("Tutor not found");
                }
                tutor.subjects.push(subjectDetails);
                const updatedTutor = yield this._tutorRepository.updateTutor(tutor);
                return updatedTutor;
            }
            catch (error) {
                console.error(error);
                throw new Error('Failed to add subject');
            }
        });
    }
    // Edit Subject
    editSubject(tutorId, subjectId, updatedSubject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield this._tutorRepository.findTutorById(tutorId);
                if (!tutor) {
                    throw new Error("Tutor not found");
                }
                const subjectIndex = tutor.subjects.findIndex((subject) => subject._id.equals(subjectId));
                if (subjectIndex === -1) {
                    throw new Error("Subject not found");
                }
                tutor.subjects[subjectIndex] = Object.assign(Object.assign({}, tutor.subjects[subjectIndex]), updatedSubject);
                const updatedTutor = yield this._tutorRepository.updateTutor(tutor);
                return updatedTutor;
            }
            catch (error) {
                console.error(error);
                throw new Error('Failed to edit subject');
            }
        });
    }
    // Delete Subject
    deleteSubject(tutorId, subjectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield this._tutorRepository.findTutorById(tutorId);
                if (!tutor) {
                    throw new Error("Tutor not found");
                }
                tutor.subjects = tutor.subjects.filter((subject) => !subject._id.equals(subjectId));
                const updatedTutor = yield this._tutorRepository.updateTutor(tutor);
                return updatedTutor;
            }
            catch (error) {
                console.error(error);
                throw new Error('Failed to delete subject');
            }
        });
    }
    fetchSubjects(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield this._tutorRepository.findTutorById(tutorId);
                if (!tutor) {
                    throw new Error("Tutor not found");
                }
                return tutor.subjects;
            }
            catch (error) {
                console.error('Error fetching subjects:', error);
                throw new Error('Failed to fetch subjects');
            }
        });
    }
    addSlot(slotData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newSlot = yield this._tutorSlotRepository.create(slotData);
                return newSlot;
            }
            catch (error) {
                throw new Error('Failed to create slot: ' + error);
            }
        });
    }
    // Edit an existing tutor slot
    editSlot(slotId, slotData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSlot = yield this._tutorSlotRepository.update(slotId, slotData);
                if (!updatedSlot) {
                    throw new Error('Slot not found');
                }
                return updatedSlot;
            }
            catch (error) {
                throw new Error('Failed to edit slot: ' + error);
            }
        });
    }
    // Get a specific slot by its ID
    getSlotById(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slot = yield this._tutorSlotRepository.findById(slotId);
                if (!slot) {
                    throw new Error('Slot not found');
                }
                return slot;
            }
            catch (error) {
                throw new Error('Failed to get slot: ' + error);
            }
        });
    }
    // Get all slots for a specific tutor
    getAllSlotsByTutorId(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slots = yield this._tutorSlotRepository.findAll(tutorId);
                return slots;
            }
            catch (error) {
                throw new Error('Failed to get slots: ' + error);
            }
        });
    }
    UpdateSlotStatus(slotId, studentId, meetingId, meetingLink) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._tutorSlotRepository.updateSlotBooking(slotId, {
                isBooked: true,
                studentId,
                meetingId,
                meetingLink,
            });
        });
    }
}
exports.TutorUseCase = TutorUseCase;
