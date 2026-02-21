import api from '../lib/api.ts';

export interface OrderDetails {
    bookId: number;
    bookName: string;
    quantity: number;
    price: number;
}
export interface Order {
    id:string;
    totalPrice: number;
    orderDetails: OrderDetails[];
    createdAt: Date;
}
export interface orderRequest {
    bookId :string;
    quantity : number;
}
export const getUserOrders = async ():Promise<Order[]> =>{
    const result = await api.get<Order[]>("orders/GetMyOrders");
    return result.data
}

export const sendOrder = async (orderRequest :orderRequest[] ) : Promise<Order> => {
    const result = await api.post<Order>("orders/PlaceOrder",orderRequest);
    return result.data;
}