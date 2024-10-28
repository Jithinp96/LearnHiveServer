export class TokenMissingOrInvalidError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TokenMissingOrInvalidError";
    }
}