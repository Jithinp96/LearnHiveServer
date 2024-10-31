import cron from 'node-cron';
import { GenerateDailySlotUseCase } from '../../application/useCases/tutor/GenerateDailySlotUseCase';
import { SlotSchedulerRepository } from '../repositories/SlotSchedulerRepository';

export class CronScheduler {
    public static initialize() {
        console.log("Inside Cron Scheduler");

        cron.schedule('0 0 * * *', async () => {
            console.log("Executing daily cron job for slot generation");
            try {
                const slotScheduler = new SlotSchedulerRepository();
                const generateDailySlotUseCase = new GenerateDailySlotUseCase(slotScheduler);
                
                const tutorsWithPreferences = await slotScheduler.fetchTutorsForSlotCreation();

                for (const tutor of tutorsWithPreferences) {
                    const { tutorId, subject, level, startTime, endTime, price, endDate } = tutor;

                    await generateDailySlotUseCase.execute( tutorId, subject, level, startTime, endTime, price, endDate );
                }

                console.log('Daily slots generated successfully for all tutors');
            } catch (error) {
                console.error('Error generating daily slots via cron:', error);
            }
        });
    }
}
