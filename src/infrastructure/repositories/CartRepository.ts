import mongoose from "mongoose";
import { ObjectId } from "mongodb";

import { Cart } from "../../domain/entities/Cart";
import { ICartRepository } from "../../domain/interfaces/ICartRepository";
import { CartModel } from "../database/models/CartModel";

export class CartRepository implements ICartRepository {
    async updateCart(cart: Cart): Promise<Cart> {
        try {
            await CartModel.updateOne({ userId: cart.userId }, cart)
            return cart as Cart;
        } catch (error) {
            console.error('Error updating cart:', error);
            throw new Error('Failed to update cart');
        }
    }

    async addCourseToCart(userId: string, courseId: string): Promise<Cart> {

        let cart = await CartModel.findOne({ userId: new mongoose.Types.ObjectId(userId) });

        if (!cart) {
            cart = new CartModel({ userId: new mongoose.Types.ObjectId(userId), items: [] });
        }

        cart.items.push({ courseId });

        await cart.save();
        return cart.toObject();
    }

    async getCartByUserId(userId: string): Promise<Cart | null> {
        const cart = await CartModel.findOne({ userId })
        .populate({
            path: 'items.courseId',        
            select: 'title category price thumbnailUrl',
            populate: {
                path: 'category',
                select: 'name',
            }
        });
        return cart ? cart.toObject() : null;
    }

    async deleteCourseFromCart(userId: string, courseId: string): Promise<Cart> {
        let cart = await CartModel.findOne({ userId: new mongoose.Types.ObjectId(userId) })
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
        const courseObjId = new ObjectId(courseId)
        
        cart.items = cart?.items.filter((item) => {
            const coureWithId = item as unknown as {courseId: ObjectId};
            return !coureWithId.courseId.equals(courseObjId)
        })
        return cart
    }
}
