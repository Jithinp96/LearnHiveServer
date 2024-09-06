export class Student {
    constructor(
        public readonly id: string,
        public name: string,
        public email: string,
        public mobile: number,
        public password: string,
        public readonly createdAt: Date
    ) {}
}