import { ICourseCategoryRepository } from "../../../domain/interfaces/ICourseCategoryRepository";
import { ICourseCategory } from "../../../infrastructure/database/models/CourseCategoryModel";
import { CreateCategoryDTO } from "../../dto/CreateCategoryDTO";

export class CourseCategoryUseCases {
    constructor(private _categoryRepo: ICourseCategoryRepository) {}

    async createCategory(data: CreateCategoryDTO): Promise<ICourseCategory> {
        const existingCategory = await this._categoryRepo.getCategoryByName(data.name);
        
        if (existingCategory) {
            throw new Error("Category already exists");
        }
        const newCategory = await this._categoryRepo.createCategory(data.name);
        return newCategory;
    }

    async updateCategory(id: string, name: string): Promise<ICourseCategory | null> {
        const existingCategory = await this._categoryRepo.getCategoryById(id);
        if (!existingCategory) {
            throw new Error("Category not found");
        }
    
        // Check if name already exists if it's being updated
        if (name && existingCategory.name !== name) {
            const existingNameCategory = await this._categoryRepo.getCategoryByName(name);
            if (existingNameCategory) {
                throw new Error("Category name already exists");
            }
        }
    
        return await this._categoryRepo.updateCategory(id, name);
    }

    // List all categories
    async getAllCategories(): Promise<ICourseCategory[]> {
        return await this._categoryRepo.getAllCategories();
    }

    async toggleCategoryStatus(id: string): Promise<ICourseCategory | null> {
        // Fetch the category by ID
        const category = await this._categoryRepo.getCategoryById(id);
        if (!category) {
            throw new Error("Category not found");
        }
    
        // Toggle the isBlocked status
        const updatedStatus = !category.isBlocked;
        const updatedCategory = await this._categoryRepo.updateCategoryStatus(id, updatedStatus);
    
        return updatedCategory;
    }
}