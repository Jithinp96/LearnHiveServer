import { ICourseRepository } from "../../../domain/interfaces/ICourseRepository";
import { IOrderRepository } from "../../../domain/interfaces/IOrderRepository";

export class StudentDashboardUseCase {
    constructor(
        private _courseRepo: ICourseRepository,
        private _orderRepo: IOrderRepository
    ) {}

    async execute(studentId: string) {
        const [newCourses, topRatedCourses, suggestedCourses, topPurchasedCourses] = await Promise.all([
            this._courseRepo.getNewCourses(4),
            this._courseRepo.getTopRatedCourses(4),
            this._courseRepo.getSuggestedCourses(studentId, 4),
            this._orderRepo.getTopPurchasedCourses(4)
        ]);
        
        return {
            newCourses,
            topRatedCourses,
            suggestedCourses,
            topPurchasedCourses
        };
    }
}