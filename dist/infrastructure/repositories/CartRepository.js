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
exports.CartRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = require("mongodb");
const CartModel_1 = require("../database/models/CartModel");
class CartRepository {
    updateCart(cart) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield CartModel_1.CartModel.updateOne({ userId: cart.userId }, cart);
                return cart;
            }
            catch (error) {
                console.error('Error updating cart:', error);
                throw new Error('Failed to update cart');
            }
        });
    }
    addCourseToCart(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            let cart = yield CartModel_1.CartModel.findOne({ userId: new mongoose_1.default.Types.ObjectId(userId) });
            if (!cart) {
                cart = new CartModel_1.CartModel({ userId: new mongoose_1.default.Types.ObjectId(userId), items: [] });
            }
            cart.items.push({ courseId });
            yield cart.save();
            return cart.toObject();
        });
    }
    getCartByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart = yield CartModel_1.CartModel.findOne({ userId })
                .populate({
                path: 'items.courseId',
                select: 'title category price thumbnailUrl',
                populate: {
                    path: 'category',
                    select: 'name',
                }
            });
            return cart ? cart.toObject() : null;
        });
    }
    deleteCourseFromCart(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            let cart = yield CartModel_1.CartModel.findOne({ userId: new mongoose_1.default.Types.ObjectId(userId) })
                .populate({
                path: 'items.courseId',
                select: 'title category price thumbnailUrl',
                populate: {
                    path: 'category',
                    select: 'name',
                }
            });
            if (!cart) {
                throw new Error("Cart not found");
            }
            const courseObjId = new mongodb_1.ObjectId(courseId);
            cart.items = cart === null || cart === void 0 ? void 0 : cart.items.filter((item) => {
                const coureWithId = item;
                return !coureWithId.courseId.equals(courseObjId);
            });
            return cart;
        });
    }
}
exports.CartRepository = CartRepository;
