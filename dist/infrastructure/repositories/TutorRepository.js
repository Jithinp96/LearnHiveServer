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
const DatabaseError_1 = require("../../domain/errors/DatabaseError");
const TutorError_1 = require("../../domain/errors/TutorError");
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
                throw new DatabaseError_1.DatabaseError();
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
                throw new TutorError_1.TutorNotFoundError();
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
                throw new TutorError_1.TutorUpdateError();
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
                throw new DatabaseError_1.DatabaseError();
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
                throw new DatabaseError_1.DatabaseError();
            }
        });
    }
    updateTutorPassword(id, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield TutorModel_1.TutorModel.updateOne({ _id: id }, { $set: { password: hashedPassword } });
            }
            catch (error) {
                throw new TutorError_1.TutorUpdateError();
            }
        });
    }
}
exports.TutorRepository = TutorRepository;
