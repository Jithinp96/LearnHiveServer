export interface IPaymentRepository {
    saveOrderDetails(order: any): Promise<any>;
    updateOrderStatus(orderId: string, status: string): Promise<any>
    getOrderById(orderId: string): Promise<any>
}