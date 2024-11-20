"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../infrastructure/middlewares/AuthMiddleware"));
const AuthService_1 = require("../../application/services/AuthService");
const StudentRepository_1 = require("../../infrastructure/repositories/StudentRepository");
const StudentController_1 = require("../controllers/StudentController");
const CourseController_1 = require("../controllers/CourseController");
const CartController_1 = require("../controllers/CartController");
const PaymentController_1 = require("../controllers/PaymentController");
const OrderController_1 = require("../controllers/OrderController");
const ReviewController_1 = require("../controllers/ReviewController");
const CommentController_1 = require("../controllers/CommentController");
const multerConfig_1 = require("../../infrastructure/config/multerConfig");
const TutorRepository_1 = require("../../infrastructure/repositories/TutorRepository");
const studentRoutes = (0, express_1.Router)();
const studentRepo = new StudentRepository_1.StudentRepository();
const tutorRepo = new TutorRepository_1.TutorRepository();
const authService = new AuthService_1.AuthService(studentRepo, tutorRepo);
const studentController = new StudentController_1.StudentController();
const courseController = new CourseController_1.CourseController();
const cartController = new CartController_1.CartController();
const paymentController = new PaymentController_1.PaymentController();
const orderController = new OrderController_1.OrderController();
const reviewController = new ReviewController_1.ReviewController();
const commentController = new CommentController_1.CommentController();
studentRoutes.post("/auth", studentController.register);
studentRoutes.post("/resend-otp", studentController.resendOTP);
studentRoutes.post("/otp-verify", studentController.verifyOTP);
studentRoutes.post('/forgot-password', studentController.forgotPassword);
studentRoutes.post('/reset-password', studentController.resetPassword);
studentRoutes.post('/login', studentController.login);
studentRoutes.post('/google-login', studentController.googleLogin);
studentRoutes.post('/logout/:role', (0, AuthMiddleware_1.default)(authService), studentController.logout);
studentRoutes.get('/dashboard', (0, AuthMiddleware_1.default)(authService), studentController.getDashboard);
studentRoutes.get('/profile/:id', (0, AuthMiddleware_1.default)(authService), studentController.getProfile);
studentRoutes.put("/profile/:id/add-education", (0, AuthMiddleware_1.default)(authService), studentController.addEducation);
studentRoutes.put("/profile/:id/edit-education/:educationId", (0, AuthMiddleware_1.default)(authService), studentController.editEducation);
studentRoutes.delete("/profile/:id/delete-education/:educationId", (0, AuthMiddleware_1.default)(authService), studentController.deleteEducation);
studentRoutes.put('/profile/edit-name', (0, AuthMiddleware_1.default)(authService), studentController.editProfileName);
studentRoutes.put('/profile/edit-mobile', (0, AuthMiddleware_1.default)(authService), studentController.editMobileNumber);
studentRoutes.put('/profile/edit-profilePic/:id', (0, AuthMiddleware_1.default)(authService), multerConfig_1.upload.single('image'), studentController.editProfilePicture);
studentRoutes.get('/tutorprofile/:tutorId', (0, AuthMiddleware_1.default)(authService), studentController.fetchTutorDetails);
studentRoutes.get('/slotbooking/:tutorId', (0, AuthMiddleware_1.default)(authService), studentController.fetchTutorSlotDetails);
studentRoutes.post('/slotbooking/create-payment-intent', (0, AuthMiddleware_1.default)(authService), paymentController.createPaymentIntent);
studentRoutes.post('/courseenroll/create-payment-intent', (0, AuthMiddleware_1.default)(authService), paymentController.createCoursePaymentIntent);
studentRoutes.post('/webhook', express_2.default.raw({ type: 'application/json' }), paymentController.handlePaymentWebhook);
studentRoutes.post('/slot-cancel/:slotOrderId', (0, AuthMiddleware_1.default)(authService), paymentController.handleRefund);
studentRoutes.get('/getcategories', courseController.getAllCategories);
studentRoutes.get('/allcourses', courseController.fetchAllCourses);
studentRoutes.get('/course/:courseId', courseController.fetchCourseDetails);
studentRoutes.get('/course-orders/', (0, AuthMiddleware_1.default)(authService), orderController.getCourseOrdersByStudent);
studentRoutes.get('/slot-orders/', (0, AuthMiddleware_1.default)(authService), orderController.getSlotOrdersByStudent);
studentRoutes.post('/add-to-cart', (0, AuthMiddleware_1.default)(authService), cartController.addCourseToCart);
studentRoutes.get('/cart', (0, AuthMiddleware_1.default)(authService), cartController.fetchCart);
studentRoutes.delete('/cart/delete/:courseId', (0, AuthMiddleware_1.default)(authService), cartController.deleteFromCart);
studentRoutes.post('/create-checkout-session', (0, AuthMiddleware_1.default)(authService), cartController.payment);
studentRoutes.post('/:courseId/reviews', (0, AuthMiddleware_1.default)(authService), reviewController.addReview);
// studentRoutes.put('/:courseId/reviews/:reviewId', AuthMiddleware(authService), reviewController.updateReview)
studentRoutes.delete('/:courseId/reviews/:reviewId', (0, AuthMiddleware_1.default)(authService), reviewController.deleteReview);
studentRoutes.post('/:courseId/comments', (0, AuthMiddleware_1.default)(authService), commentController.addComment);
studentRoutes.put('/:courseId/comments/:commentId', (0, AuthMiddleware_1.default)(authService), commentController.editComment);
studentRoutes.delete('/:courseId/comments/:commentId', (0, AuthMiddleware_1.default)(authService), commentController.deleteComment);
exports.default = studentRoutes;