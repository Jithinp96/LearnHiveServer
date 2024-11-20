"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileErrorEnum = exports.TutorErrorEnum = exports.StudentErrorEnum = exports.AuthErrorEnum = exports.DatabaseErrorEnum = void 0;
var DatabaseErrorEnum;
(function (DatabaseErrorEnum) {
    //Database Errors
    DatabaseErrorEnum["DATABASE_ERROR"] = "A database error occurred. Please try again later!";
})(DatabaseErrorEnum || (exports.DatabaseErrorEnum = DatabaseErrorEnum = {}));
var AuthErrorEnum;
(function (AuthErrorEnum) {
    //Authentication Errors
    AuthErrorEnum["LOGIN_FAILED"] = "Failed to login. Please try again!";
    AuthErrorEnum["INVALID_EMAIL_PASSWORD"] = "Invalid email or password. Please check the credentials!";
    AuthErrorEnum["ACCOUNT_BLOCKED"] = "Your account is blocked. Please contact our support team!";
    AuthErrorEnum["ACCOUNT_NOT_VERIFIED"] = "Your account is not verified. Please verify and continue!";
    AuthErrorEnum["EMAIL_NOT_RECEIVED"] = "Email address is missing. Please try again!";
    AuthErrorEnum["EMAIL_OTP_NOT_RECEIVED"] = "Email and OTP are required. Please enter the details and try again!";
    AuthErrorEnum["INVALID_OR_EXPIRED_TOKEN"] = "Invalid or Expired token. Please login again!";
    AuthErrorEnum["INVALID_ID"] = "Invalid Id! Please Login again!";
})(AuthErrorEnum || (exports.AuthErrorEnum = AuthErrorEnum = {}));
var StudentErrorEnum;
(function (StudentErrorEnum) {
    //Student Errors
    StudentErrorEnum["STUDENT_NOT_FOUND"] = "Student details not found. Please check the credentials and try again!";
    StudentErrorEnum["STUDENT_UPDATE_ERROR"] = "Failed to update student details. Please try again!";
    StudentErrorEnum["STUDENT_ALREADY_EXISTS"] = "This email address is already registered. Please try with new email address!";
    StudentErrorEnum["STUDENT_REGISTRATION_ERROR"] = "Student registration failed. Please try again later!";
})(StudentErrorEnum || (exports.StudentErrorEnum = StudentErrorEnum = {}));
var TutorErrorEnum;
(function (TutorErrorEnum) {
    //Tutor Errors
    TutorErrorEnum["TUTOR_NOT_FOUND"] = "Tutor details not found. Please check the credentials and try again!";
    TutorErrorEnum["TUTOR_UPDATE_ERROR"] = "Failed to update Tutor details. Please try again!";
    TutorErrorEnum["TUTOR_ALREADY_EXISTS"] = "This email address is already registered. Please try with new email address!";
    TutorErrorEnum["TUTOR_REGISTRATION_ERROR"] = "Tutor registration failed. Please try again later!";
})(TutorErrorEnum || (exports.TutorErrorEnum = TutorErrorEnum = {}));
var ProfileErrorEnum;
(function (ProfileErrorEnum) {
    ProfileErrorEnum["EDU_NOT_FOUND"] = "Education details not found, Please try again!";
    ProfileErrorEnum["EDU_UPDATE_FAILED"] = "Failed to edit education details. Please try again!";
    ProfileErrorEnum["EDU_ADD_FAILED"] = "Failed to add education details. Please try again!";
    ProfileErrorEnum["EDU_DELETE_FAILED"] = "Failed to edit education details. Please try again!";
})(ProfileErrorEnum || (exports.ProfileErrorEnum = ProfileErrorEnum = {}));
