import { useState, useEffect } from "react";
import { getUserOrders ,type Order } from "../services/OrderService";
import Navbar from "../components/navbar.component.tsx";
import {Link} from   "react-router-dom"

function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await getUserOrders();
            setOrders(data);
        } catch (err: any) {
            setError("Failed to load orders. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date) => {
        console.log(date)
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading your orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <h2 className="mb-3">My Orders</h2>
                    <div className="alert alert-info">
                        <h5>No orders yet</h5>
                        <p className="mb-0">Start shopping to see your order history here!</p>
                        <Link to={"/"}> ← Go back</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar/>
            <div className="container mt-4 mb-5">
                <h2 className="mb-4">My Orders</h2>
                <p className="text-muted mb-4">You have {orders.length} order{orders.length !== 1 ? 's' : ''}</p>

                <div className="row g-4">
                    {orders.map((order) => (
                        <div key={order.id} className="col-12">
                            <div className="card shadow-sm">
                                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>Order #{order.id.substring(0, 8)}</strong>
                                        <span className="ms-3 small">{formatDate(order.createdAt)}</span>
                                    </div>

                                    <div>
                                        <strong className="fs-5">${order.totalPrice.toFixed(2)}</strong>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <h6 className="mb-3">Order Items:</h6>
                                    <div className="table-responsive">
                                        <table className="table table-sm">
                                            <thead>
                                            <tr>
                                                <th>Book</th>
                                                <th className="text-center">Quantity</th>
                                                <th className="text-end">Price</th>
                                                <th className="text-end">Subtotal</th>
                                            </tr>
                                            </thead>
                                            <tbody>

                                            {order.orderDetails.map((item,index) => (
                                                <tr key={`${item.bookId}-${index}`}>
                                                    <td>{item.bookName}</td>
                                                    <td className="text-center">{item.quantity}</td>
                                                    <td className="text-end">${item.price.toFixed(2)}</td>
                                                    <td className="text-end">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </td>
                                            </tr>
                                            ))}

                                            </tbody>

                                            <tfoot>
                                            <tr className="fw-bold">
                                                <td colSpan={3} className="text-end">Total:</td>
                                                <td className="text-end">${order.totalPrice.toFixed(2)}</td>
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default OrdersPage;