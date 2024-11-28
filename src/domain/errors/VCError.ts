export class InvalidMeetingRoomError extends Error {
    constructor() {
        super('Invalid meeting room');
        this.name = 'InvalidMeetingRoomError';
    }
}

export class UnauthorizedAccessError extends Error {
    constructor() {
        super('You are not authorized to join this meeting');
        this.name = 'UnauthorizedAccessError';
    }
}

export class SlotNotBookedError extends Error {
    constructor() {
        super('This meeting slot is not booked');
        this.name = 'SlotNotBookedError';
    }
}

export class MeetingNotActiveError extends Error {
    constructor() {
        super('Meeting is not currently active. Please join around meeting scheduled time!');
        this.name = 'MeetingNotActiveError';
    }
}
