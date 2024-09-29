import { ICourseCategoryRepository } from "../../domain/interfaces/ICourseCategoryRepository";
import { CourseCategoryModel, ICourseCategory } from "../database/models/CourseCategoryModel";

export class CourseCategoryRepository implements ICourseCategoryRepository {
    async createCategory(name: string): Promise<ICourseCategory> {
        try {
            const category = new CourseCategoryModel({ name });
            return await category.save();
        } catch (error: any) {
            if (error.code === 11000) {
                throw new Error("Category already exists");
            }
            throw error;
        }
    }

    async updateCategory(id: string, name: string): Promise<ICourseCategory | null> {
        const updateData: { name?: string; isBlocked?: boolean } = {};
        
        if (name) {
            updateData.name = name;
        }

        return CourseCategoryModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async getCategoryByName(name: string): Promise<ICourseCategory | null> {
        return CourseCategoryModel.findOne({ name });
    }

    async getAllCategories(): Promise<ICourseCategory[]> {
        return CourseCategoryModel.find();
    }

    async updateCategoryStatus(id: string, isBlocked: boolean): Promise<ICourseCategory | null> {
        return CourseCategoryModel.findByIdAndUpdate(id, { isBlocked }, { new: true });
    }

    async getCategoryById(id: string): Promise<ICourseCategory | null> {
        return CourseCategoryModel.findById(id);
    }

    async incrementCourseCount(categoryId: string): Promise<void> {
        await CourseCategoryModel.findByIdAndUpdate(categoryId, { $inc: { coursesCount: 1 } });
    }

    async decrementCourseCount(categoryId: string): Promise<void> {
        await CourseCategoryModel.findByIdAndUpdate(categoryId, { $inc: { coursesCount: -1 } });
    }
}