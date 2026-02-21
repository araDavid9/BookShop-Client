import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import {sendOrder,type orderRequest} from "../services/OrderService.ts";

function CartPage() {
    const { cart, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRemoveItem = (bookId: string) => {
        if (confirm("Remove this item from cart?")) {
            removeFromCart(bookId);
        }
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        setIsCheckingOut(true);
        setError("");


        const orderItems: orderRequest[] = cart.map(item => ({
            bookId: item.bookId,
            quantity: item.quantity
        }));

        await sendOrder(orderItems)
            .then(result => {
                clearCart();
                alert(`Order:${result.id} has been placed successfully!`);
                navigate("/orders");
            })
            .catch(err => {
                setError(err.response?.data?.message || "Failed to place order. Please try again.");
            })
            .finally(() => setIsCheckingOut(false));
    }


    if (cart.length === 0) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <h2 className="mb-4">Shopping Cart</h2>
                    <div className="alert alert-info">
                        <h5>Your cart is empty</h5>
                        <p className="mb-3">Add some books to get started!</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/")}
                        >
                            Browse Books
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 mb-5">
            <h2 className="mb-4">Shopping Cart</h2>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError("")}
                    ></button>
                </div>
            )}

            <div className="row">
                {/* Cart Items */}
                <div className="col-lg-8">
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-3">
                                Items ({getTotalItems()})
                            </h5>

                            {cart.map((item) => (
                                <div
                                    key={item.bookId}
                                    className="d-flex align-items-center border-bottom py-3"
                                >
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1">{item.bookName}</h6>
                                        <p className="text-muted mb-1 small">
                                            ${item.price.toFixed(2)} each
                                        </p>
                                        <p className="mb-0">
                                            <strong>Quantity:</strong> {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-end me-3">
                                        <p className="mb-0 fw-bold">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleRemoveItem(item.bookId)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate("/")}
                    >
                        ← Continue Shopping
                    </button>
                </div>

                {/* Order Summary */}
                <div className="col-lg-4">
                    <div className="card shadow-sm sticky-top" style={{ top: "20px" }}>
                        <div className="card-body">
                            <h5 className="card-title mb-4">Order Summary</h5>

                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal ({getTotalItems()} items)</span>
                                <span>${getTotalPrice().toFixed(2)}</span>
                            </div>

                            <div className="d-flex justify-content-between mb-2">
                                <span>Shipping</span>
                                <span className="text-success">Free</span>
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between mb-4">
                                <strong>Total</strong>
                                <strong className="fs-5 text-primary">
                                    ${getTotalPrice().toFixed(2)}
                                </strong>
                            </div>

                            <button
                                className="btn btn-primary w-100 mb-2"
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                            >
                                {isCheckingOut ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Processing...
                                    </>
                                ) : (
                                    "Proceed to Checkout"
                                )}
                            </button>

                            <button
                                className="btn btn-outline-danger w-100"
                                onClick={() => {
                                    if (confirm("Clear all items from cart?")) {
                                        clearCart();
                                    }
                                }}
                                disabled={isCheckingOut}
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;