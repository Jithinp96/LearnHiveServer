export interface ISlotSchedulerRepository {
    fetchTutorsForSlotCreation(): Promise<Array<{ tutorId: string, subject: string, level: string, startTime: string, endTime: string, price: number, endDate: Date }>>;
    generateDailySlots( tutorId: string, subject: string, level: string, startTime: string, endTime: string, price: number ): Promise<void>;
}