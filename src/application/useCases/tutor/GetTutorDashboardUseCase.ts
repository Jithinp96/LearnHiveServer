import { ITutorDashboardRepository } from "../../../domain/interfaces/ITutorDahsboardRepository";
import { TutorDashboardDataDTO } from "../../dto/TutorDahsboardDataDTO";

export class GetTutorDashboardUseCase {
    constructor(
        private _tutorDahsboardRepo: ITutorDashboardRepository
    ) {}

    async execute(tutorId: string): Promise<TutorDashboardDataDTO> {
        const [courseRevenue, slotRevenue, totalCoursePurchases, trendingCourses] = await Promise.all([
            this._tutorDahsboardRepo.getCourseRevenueByTutor(tutorId),
            this._tutorDahsboardRepo.getSlotRevenueByTutor(tutorId),
            this._tutorDahsboardRepo.getTotalCoursePurchasesByTutor(tutorId),
            this._tutorDahsboardRepo.getTrendingCoursesByTutor(tutorId)
        ]);

        const trendingCourse = trendingCourses.length > 0 ? trendingCourses[0] : null;

        return {
            totalRevenue: courseRevenue + slotRevenue,
            courseRevenue,
            slotRevenue,
            totalCoursePurchases,
            trendingCourse,
            trendingCourses
        };
    }
}
