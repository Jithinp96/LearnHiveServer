export interface TutorDashboardDataDTO {
    totalRevenue: number;
    courseRevenue: number;
    slotRevenue: number;
    totalCoursePurchases: number;
    trendingCourse: {
        courseId: string;
        title: string;
        purchaseCount: number;
    } | null;
    trendingCourses: {
        courseId: string;
        title: string;
        purchaseCount: number;
    }[] | null;
}
