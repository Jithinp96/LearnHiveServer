import { IAdminDashboardRepository } from "../../../domain/interfaces/IAdminDashboardRepository";


export class GetAdminDashboardStatsUseCase {
  constructor(private _adminDashboardRepository: IAdminDashboardRepository) {}

  async execute() {
    const totalStudents = await this._adminDashboardRepository.countStudents();
    const totalTutors = await this._adminDashboardRepository.countTutors();
    const totalCourseRevenue = await this._adminDashboardRepository.calculateCourseRevenue();
    const totalSlotRevenue = await this._adminDashboardRepository.calculateSlotRevenue();
    const topCourses = await this._adminDashboardRepository.getTopCourses(5);
    const topCategories = await this._adminDashboardRepository.getTopCategories(5);
    const topTutors = await this._adminDashboardRepository.getTopTutors(3);

    return {
      totalStudents,
      totalTutors,
      totalCourseRevenue,
      totalSlotRevenue,
      topCourses,
      topCategories,
      topTutors,
    };
  }
}
