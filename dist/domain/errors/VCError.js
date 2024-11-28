"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingNotActiveError = exports.SlotNotBookedError = exports.UnauthorizedAccessError = exports.InvalidMeetingRoomError = void 0;
class InvalidMeetingRoomError extends Error {
    constructor() {
        super('Invalid meeting room');
        this.name = 'InvalidMeetingRoomError';
    }
}
exports.InvalidMeetingRoomError = InvalidMeetingRoomError;
class UnauthorizedAccessError extends Error {
    constructor() {
        super('You are not authorized to join this meeting');
        this.name = 'UnauthorizedAccessError';
    }
}
exports.UnauthorizedAccessError = UnauthorizedAccessError;
class SlotNotBookedError extends Error {
    constructor() {
        super('This meeting slot is not booked');
        this.name = 'SlotNotBookedError';
    }
}
exports.SlotNotBookedError = SlotNotBookedError;
class MeetingNotActiveError extends Error {
    constructor() {
        super('Meeting is not currently active. Please join around meeting scheduled time!');
        this.name = 'MeetingNotActiveError';
    }
}
exports.MeetingNotActiveError = MeetingNotActiveError;
