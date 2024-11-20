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
exports.TutorRepository = void 0;
const TutorModel_1 = require("../database/models/TutorModel");
class TutorRepository {
    createTutor(tutor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newTutor = new TutorModel_1.TutorModel(tutor);
                yield newTutor.save();
                return newTutor.toObject();
            }
            catch (error) {
                console.error('Error creating tutor:', error);
                throw new Error('Failed to create tutor');
            }
        });
    }
    findTutorByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield TutorModel_1.TutorModel.findOne({ email }).lean().exec();
                return tutor;
            }
            catch (error) {
                console.error('Error finding tutor by email:', error);
                throw new Error('Failed to find tutor by email');
            }
        });
    }
    updateTutor(tutor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield TutorModel_1.TutorModel.updateOne({ email: tutor.email }, tutor);
                return tutor;
            }
            catch (error) {
                console.error('Error updating tutor:', error);
                throw new Error('Failed to update tutor');
            }
        });
    }
    getAllTutors() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutors = yield TutorModel_1.TutorModel.find().lean().exec();
                return tutors;
            }
            catch (error) {
                console.error('Error fetching all tutors:', error);
                throw new Error('Failed to retrieve tutors');
            }
        });
    }
    findTutorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield TutorModel_1.TutorModel.findById(id).lean();
                return tutor;
            }
            catch (error) {
                console.error('Error finding tutor by ID:', error);
                throw new Error('Failed to find tutor by ID');
            }
        });
    }
    updateTutorPassword(id, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield TutorModel_1.TutorModel.updateOne({ _id: id }, { $set: { password: hashedPassword } });
            }
            catch (error) {
                console.error('Error updating student password:', error);
                throw new Error('Failed to update student password');
            }
        });
    }
}
exports.TutorRepository = TutorRepository;
