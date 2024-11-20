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
exports.CourseCategoryUseCases = void 0;
class CourseCategoryUseCases {
    constructor(_categoryRepo) {
        this._categoryRepo = _categoryRepo;
    }
    createCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCategory = yield this._categoryRepo.getCategoryByName(data.name);
            if (existingCategory) {
                throw new Error("Category already exists");
            }
            const newCategory = yield this._categoryRepo.createCategory(data.name);
            return newCategory;
        });
    }
    updateCategory(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCategory = yield this._categoryRepo.getCategoryById(id);
            if (!existingCategory) {
                throw new Error("Category not found");
            }
            // Check if name already exists if it's being updated
            if (name && existingCategory.name !== name) {
                const existingNameCategory = yield this._categoryRepo.getCategoryByName(name);
                if (existingNameCategory) {
                    throw new Error("Category name already exists");
                }
            }
            return yield this._categoryRepo.updateCategory(id, name);
        });
    }
    // List all categories
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._categoryRepo.getAllCategories();
        });
    }
    toggleCategoryStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the category by ID
            const category = yield this._categoryRepo.getCategoryById(id);
            if (!category) {
                throw new Error("Category not found");
            }
            // Toggle the isBlocked status
            const updatedStatus = !category.isBlocked;
            const updatedCategory = yield this._categoryRepo.updateCategoryStatus(id, updatedStatus);
            return updatedCategory;
        });
    }
}
exports.CourseCategoryUseCases = CourseCategoryUseCases;
