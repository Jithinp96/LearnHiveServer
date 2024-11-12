import { Router } from "express";
import express from 'express';

import AuthMiddleware from "../../infrastructure/middlewares/AuthMiddleware";
import { AuthService } from "../../application/services/AuthService";

import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";

import { StudentController } from "../controllers/StudentController";
import { CourseController } from "../controllers/CourseController";
import { CartController } from "../controllers/CartController";
import { PaymentController } from "../controllers/PaymentController";
import { OrderController } from "../controllers/OrderController";
import { ReviewController } from "../controllers/ReviewController";
import { CommentController } from "../controllers/CommentController";

import { upload } from "../../infrastructure/config/multerConfig";
import { TutorRepository } from "../../infrastructure/repositories/TutorRepository";

const studentRoutes = Router();

const studentRepo = new StudentRepository();
const tutorRepo = new TutorRepository()
const authService = new AuthService(studentRepo, tutorRepo)

const studentController = new StudentController();
const courseController = new CourseController();
const cartController = new CartController()
const paymentController = new PaymentController();
const orderController = new OrderController()
const reviewController = new ReviewController()
const commentController = new CommentController()

studentRoutes.post("/auth", studentController.register);
studentRoutes.post("/resend-otp", studentController.resendOTP);
studentRoutes.post("/otp-verify", studentController.verifyOTP);
studentRoutes.post('/forgot-password', studentController.forgotPassword); 
studentRoutes.post('/reset-password', studentController.resetPassword);

studentRoutes.post('/login', studentController.login);
studentRoutes.post('/logout/:role', AuthMiddleware(authService), studentController.logout);

studentRoutes.get('/dashboard', AuthMiddleware(authService), studentController.getDashboard)

studentRoutes.get('/profile/:id', AuthMiddleware(authService), studentController.getProfile);
studentRoutes.put("/profile/:id/add-education", AuthMiddleware(authService), studentController.addEducation);
studentRoutes.put("/profile/:id/edit-education/:educationId", AuthMiddleware(authService), studentController.editEducation);
studentRoutes.delete("/profile/:id/delete-education/:educationId", AuthMiddleware(authService), studentController.deleteEducation);

studentRoutes.put('/profile/edit-name', AuthMiddleware(authService), studentController.editProfileName)
studentRoutes.put('/profile/edit-mobile', AuthMiddleware(authService), studentController.editMobileNumber)
studentRoutes.put('/profile/edit-profilePic/:id', AuthMiddleware(authService), upload.single('image'), studentController.editProfilePicture)

studentRoutes.get('/tutorprofile/:tutorId', AuthMiddleware(authService), studentController.fetchTutorDetails)
studentRoutes.get('/slotbooking/:tutorId', AuthMiddleware(authService), studentController.fetchTutorSlotDetails)

studentRoutes.post('/slotbooking/create-payment-intent', AuthMiddleware(authService), paymentController.createPaymentIntent)
studentRoutes.post('/courseenroll/create-payment-intent', AuthMiddleware(authService), paymentController.createCoursePaymentIntent)
studentRoutes.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handlePaymentWebhook);
studentRoutes.post('/slot-cancel/:slotOrderId', AuthMiddleware(authService), paymentController.handleRefund)

studentRoutes.get('/getcategories', courseController.getAllCategories);

studentRoutes.get('/allcourses', courseController.fetchAllCourses);
studentRoutes.get('/course/:courseId', courseController.fetchCourseDetails);

studentRoutes.get('/course-orders/', AuthMiddleware(authService), orderController.getCourseOrdersByStudent)
studentRoutes.get('/slot-orders/', AuthMiddleware(authService), orderController.getSlotOrdersByStudent)

studentRoutes.post('/add-to-cart', AuthMiddleware(authService), cartController.addCourseToCart);
studentRoutes.get('/cart', AuthMiddleware(authService), cartController.fetchCart)
studentRoutes.delete('/cart/delete/:courseId', AuthMiddleware(authService), cartController.deleteFromCart)

studentRoutes.post('/create-checkout-session', AuthMiddleware(authService), cartController.payment)

studentRoutes.post('/:courseId/reviews', AuthMiddleware(authService), reviewController.addReview)
// studentRoutes.put('/:courseId/reviews/:reviewId', AuthMiddleware(authService), reviewController.updateReview)
studentRoutes.delete('/:courseId/reviews/:reviewId', AuthMiddleware(authService), reviewController.deleteReview)

studentRoutes.post('/:courseId/comments', AuthMiddleware(authService), commentController.addComment)
studentRoutes.put('/:courseId/comments/:commentId', AuthMiddleware(authService), commentController.editComment)
studentRoutes.delete('/:courseId/comments/:commentId', AuthMiddleware(authService), commentController.deleteComment)

export default studentRoutes;