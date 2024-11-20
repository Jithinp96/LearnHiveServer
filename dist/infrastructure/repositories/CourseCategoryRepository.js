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
exports.CourseCategoryRepository = void 0;
const CourseCategoryModel_1 = require("../database/models/CourseCategoryModel");
class CourseCategoryRepository {
    createCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = new CourseCategoryModel_1.CourseCategoryModel({ name });
                return yield category.save();
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new Error("Category already exists");
                }
                throw error;
            }
        });
    }
    updateCategory(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = {};
            if (name) {
                updateData.name = name;
            }
            return CourseCategoryModel_1.CourseCategoryModel.findByIdAndUpdate(id, updateData, { new: true });
        });
    }
    getCategoryByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return CourseCategoryModel_1.CourseCategoryModel.findOne({ name });
        });
    }
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return CourseCategoryModel_1.CourseCategoryModel.find();
        });
    }
    updateCategoryStatus(id, isBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            return CourseCategoryModel_1.CourseCategoryModel.findByIdAndUpdate(id, { isBlocked }, { new: true });
        });
    }
    getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return CourseCategoryModel_1.CourseCategoryModel.findById(id);
        });
    }
    incrementCourseCount(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield CourseCategoryModel_1.CourseCategoryModel.findByIdAndUpdate(categoryId, { $inc: { coursesCount: 1 } });
        });
    }
    decrementCourseCount(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield CourseCategoryModel_1.CourseCategoryModel.findByIdAndUpdate(categoryId, { $inc: { coursesCount: -1 } });
        });
    }
}
exports.CourseCategoryRepository = CourseCategoryRepository;
