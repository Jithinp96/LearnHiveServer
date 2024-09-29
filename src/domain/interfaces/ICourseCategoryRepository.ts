import { ICourseCategory } from "../../infrastructure/database/models/CourseCategoryModel";

export interface ICourseCategoryRepository {
    createCategory(name: string): Promise<ICourseCategory>;
    updateCategory(id: string, name: string): Promise<ICourseCategory | null>;
    getCategoryByName(name: string): Promise<ICourseCategory | null>; 
    getAllCategories(): Promise<ICourseCategory[]>;
    updateCategoryStatus(id: string, isBlocked: boolean): Promise<ICourseCategory | null>;
    getCategoryById(id: string): Promise<ICourseCategory | null>;
    incrementCourseCount(categoryId: string): Promise<void>;
    decrementCourseCount(categoryId: string): Promise<void>;
}