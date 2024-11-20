"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessMessageEnum = void 0;
var SuccessMessageEnum;
(function (SuccessMessageEnum) {
    SuccessMessageEnum["REGISTRATION_SUCCESS"] = "Registration successful. OTP sent to email.";
    SuccessMessageEnum["OTP_RESENT"] = "OTP Resent Successfully! Please check your email.";
    SuccessMessageEnum["OTP_VERIFIED"] = "OTP Verified Successfully!";
    SuccessMessageEnum["LOGIN_SUCCESS"] = "Login Successful!";
    SuccessMessageEnum["RESET_PASSWORD_LINK_SENT"] = "Password reset link sent to your email address!";
    SuccessMessageEnum["RESET_PASSWORD_SUCCESS"] = "Password reset successfully!";
    SuccessMessageEnum["LOGOUT_SUCCESS"] = "Logout Successful!";
    SuccessMessageEnum["UPDATE_EDUCATION_SUCCESS"] = "Education details updated successfully";
})(SuccessMessageEnum || (exports.SuccessMessageEnum = SuccessMessageEnum = {}));
