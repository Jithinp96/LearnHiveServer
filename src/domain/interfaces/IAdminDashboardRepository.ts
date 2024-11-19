export interface IAdminDashboardRepository {
    countStudents(): Promise<number>;
    countTutors(): Promise<number>;
    calculateCourseRevenue(): Promise<number>;
    calculateSlotRevenue(): Promise<number>;
    getTopCourses(limit: number): Promise<any[]>;
    getTopCategories(limit: number): Promise<any[]>;
    getTopTutors(limit: number): Promise<any[]>;
  }
  