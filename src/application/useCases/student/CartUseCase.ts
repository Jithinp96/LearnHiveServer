import { ICartRepository } from "../../../domain/interfaces/ICartRepository";

export class CartUseCase {
    constructor(
        private _cartRepository: ICartRepository
    ) {}

    async addToCart(userId: string, courseId: string) {
        const updatedCart = await this._cartRepository.addCourseToCart(userId, courseId);
        return updatedCart;
    }

    async fetchCart(userId: string) {
        const cart = await this._cartRepository.getCartByUserId(userId);
        return cart;
    }

    async deleteFromCart(userId: string, courseId: string) {
        const updatedCart = await this._cartRepository.deleteCourseFromCart(userId, courseId)
        const newCart = await this._cartRepository.updateCart(updatedCart)
        return newCart
    }
}