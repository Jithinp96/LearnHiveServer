export enum DatabaseErrorEnum {
    //Database Errors
    DATABASE_ERROR = "A database error occurred. Please try again later!",
}

export enum AuthErrorEnum {
    //Authentication Errors
    LOGIN_FAILED = "Failed to login. Please try again!",
    INVALID_EMAIL_PASSWORD = "Invalid email or password. Please check the credentials!",
    ACCOUNT_BLOCKED = "Your account is blocked. Please contact our support team!",
    ACCOUNT_NOT_VERIFIED = "Your account is not verified. Please verify and continue!",
    EMAIL_NOT_RECEIVED = "Email address is missing. Please try again!",
    EMAIL_OTP_NOT_RECEIVED = "Email and OTP are required. Please enter the details and try again!",
    INVALID_OR_EXPIRED_TOKEN = "Invalid or Expired token. Please login again!",
    INVALID_ID = "Invalid Id! Please Login again!",
}

export enum StudentErrorEnum {
    //Student Errors
    STUDENT_NOT_FOUND = "Student details not found. Please check the credentials and try again!",
    STUDENT_UPDATE_ERROR = "Failed to update student details. Please try again!",
    STUDENT_ALREADY_EXISTS = "This email address is already registered. Please try with new email address!",
    STUDENT_REGISTRATION_ERROR = "Student registration failed. Please try again later!",
}

export enum TutorErrorEnum {
    //Tutor Errors
    TUTOR_NOT_FOUND = "Tutor details not found. Please check the credentials and try again!",
    TUTOR_UPDATE_ERROR = "Failed to update Tutor details. Please try again!",
    TUTOR_ALREADY_EXISTS = "This email address is already registered. Please try with new email address!",
    TUTOR_REGISTRATION_ERROR = "Tutor registration failed. Please try again later!",
}

export enum ProfileErrorEnum {
    EDU_NOT_FOUND = "Education details not found, Please try again!",
    EDU_UPDATE_FAILED = "Failed to edit education details. Please try again!",
    EDU_ADD_FAILED = "Failed to add education details. Please try again!",
    EDU_DELETE_FAILED = "Failed to edit education details. Please try again!",
    
}
