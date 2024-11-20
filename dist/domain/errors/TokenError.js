"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenMissingOrInvalidError = void 0;
class TokenMissingOrInvalidError extends Error {
    constructor(message) {
        super(message);
        this.name = "TokenMissingOrInvalidError";
    }
}
exports.TokenMissingOrInvalidError = TokenMissingOrInvalidError;
