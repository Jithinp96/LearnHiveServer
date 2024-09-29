export enum ErrorMessageEnum {
    // Authentication Errors
    AUTH_INVALID_CREDENTIALS = "Invalid credentials",
    AUTH_TOKEN_EXPIRED = "Token has expired",
    AUTH_UNAUTHORIZED = "Unauthorized access",

    // Validation Errors
    VALIDATION_EMAIL_REQUIRED = "Email is required",
    VALIDATION_INVALID_EMAIL = "Invalid email format",
    VALIDATION_PASSWORD_TOO_SHORT = "Password must be at least 6 characters",

    // Resource Errors
    RESOURCE_NOT_FOUND = "Resource not found",
    RESOURCE_ALREADY_EXISTS = "Resource already exists",

    // Server Errors
    SERVER_ERROR = "An internal server error occurred",
}