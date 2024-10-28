import { DatabaseErrorEnum } from "../../shared/enums/ErrorMessagesEnum";

export class DatabaseError extends Error {
    constructor(message: string = DatabaseErrorEnum.DATABASE_ERROR) {
        super(message);
        this.name = 'DatabaseError';
    }
}