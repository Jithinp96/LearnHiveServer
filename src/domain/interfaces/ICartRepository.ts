import { Cart } from "../entities/Cart";

export interface ICartRepository {
    addCourseToCart(userId: string, courseId: string): Promise<Cart>;
    getCartByUserId(userId: string): Promise<Cart | null>;
    deleteCourseFromCart(userId: string, courseId: string): Promise<Cart>
    updateCart(cart: Cart): Promise<Cart>;
}