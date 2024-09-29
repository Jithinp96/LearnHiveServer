export class Category {
    constructor(
        public name: string,
        public courseCount: number = 0,
        public isBlocked: boolean = false
    ) {}
}