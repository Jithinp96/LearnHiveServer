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
exports.StudentRepository = void 0;
const DatabaseError_1 = require("../../domain/errors/DatabaseError");
const StudentError_1 = require("../../domain/errors/StudentError");
const StudentModel_1 = require("../database/models/StudentModel");
class StudentRepository {
    createStudent(student) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newStudent = new StudentModel_1.StudentModel(student);
                yield newStudent.save();
                return newStudent.toObject();
            }
            catch (error) {
                console.log("Error from create student in studentRepo: ", error);
                throw new DatabaseError_1.DatabaseError();
            }
        });
    }
    findStudentByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield StudentModel_1.StudentModel.findOne({ email }).lean().exec();
                return student;
            }
            catch (error) {
                throw new StudentError_1.StudentNotFoundError();
            }
        });
    }
    updateStudent(student) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield StudentModel_1.StudentModel.updateOne({ email: student.email }, student);
                return student;
            }
            catch (error) {
                throw new StudentError_1.StudentUpdateError();
            }
        });
    }
    getAllStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const students = yield StudentModel_1.StudentModel.find().lean().exec();
                return students;
            }
            catch (error) {
                throw new DatabaseError_1.DatabaseError();
            }
        });
    }
    findStudentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield StudentModel_1.StudentModel.findById(id).lean();
                return student;
            }
            catch (error) {
                throw new DatabaseError_1.DatabaseError();
            }
        });
    }
    updateStudentPassword(id, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield StudentModel_1.StudentModel.updateOne({ _id: id }, { $set: { password: hashedPassword } });
            }
            catch (error) {
                throw new StudentError_1.StudentUpdateError();
            }
        });
    }
}
exports.StudentRepository = StudentRepository;
