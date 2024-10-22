export interface CartItem {
    courseId: string;
}

export interface Cart {
    userId: string;
    items: CartItem[]
}