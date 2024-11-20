"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = void 0;
const ErrorMessagesEnum_1 = require("../../shared/enums/ErrorMessagesEnum");
class DatabaseError extends Error {
    constructor(message = ErrorMessagesEnum_1.DatabaseErrorEnum.DATABASE_ERROR) {
        super(message);
        this.name = 'DatabaseError';
    }
}
exports.DatabaseError = DatabaseError;
