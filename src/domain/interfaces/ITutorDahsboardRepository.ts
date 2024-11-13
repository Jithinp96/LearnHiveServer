export interface ITutorDashboardRepository {
    getCourseRevenueByTutor(tutorId: string): Promise<number>;
    getTotalCoursePurchasesByTutor(tutorId: string): Promise<number>;
    getTrendingCourseByTutor(tutorId: string): Promise<{ courseId: string; title: string; purchaseCount: number } | null>;
    getTrendingCoursesByTutor(tutorId: string): Promise<{ courseId: string; title: string; purchaseCount: number }[]>;
    getSlotRevenueByTutor(tutorId: string): Promise<number>;
}