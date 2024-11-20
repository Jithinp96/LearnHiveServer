"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
// import Stripe from "stripe";
const CartUseCase_1 = require("../../application/useCases/student/CartUseCase");
const CartRepository_1 = require("../../infrastructure/repositories/CartRepository");
const stripe_1 = __importDefault(require("stripe"));
class CartController {
    constructor() {
        this.addCourseToCart = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { courseId } = req.body;
            const studentId = req.userId;
            if (!studentId) {
                res.status(401).json({ message: 'Unauthorized: Student ID is required.' });
                return;
            }
            try {
                const updatedCart = yield this._cartUseCase.addToCart(studentId, courseId);
                console.log(updatedCart);
                res.status(200).json(updatedCart);
            }
            catch (error) {
                res.status(500).json({ message: 'Failed to add course to cart' });
            }
        });
        this.fetchCart = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = req.userId;
                if (!studentId) {
                    res.status(401).json({ message: 'Unauthorized: Student ID is required.' });
                    return;
                }
                const cart = yield this._cartUseCase.fetchCart(studentId);
                res.status(200).json(cart);
            }
            catch (error) {
                res.status(500).json({ message: 'Failed to load cart' });
            }
        });
        this.deleteFromCart = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = req.userId;
                const { courseId } = req.params;
                if (!studentId) {
                    res.status(401).json({ message: 'Unauthorized: Student ID is required.' });
                    return;
                }
                const cart = yield this._cartUseCase.deleteFromCart(studentId, courseId);
                res.status(200).json(cart);
            }
            catch (error) {
                res.status(500).json({ message: 'Failed to remove from cart' });
            }
        });
        this.payment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
                const { cartDetails } = req.body;
                const studentId = req.userId;
                const line_items = cartDetails.map((item) => ({
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.courseId.title,
                        },
                        unit_amount: item.courseId.price * 100,
                    },
                    quantity: 1,
                }));
                const session = yield stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: line_items,
                    mode: 'payment',
                    success_url: `${process.env.CORSURL}/paymentsuccess`,
                    cancel_url: `${process.env.CORSURL}/paymentfailure`
                });
                res.json({ session });
            }
            catch (error) {
                console.error("Unable to process payment: ", error);
            }
        });
        const cartRepository = new CartRepository_1.CartRepository();
        this._cartUseCase = new CartUseCase_1.CartUseCase(cartRepository);
    }
}
exports.CartController = CartController;
