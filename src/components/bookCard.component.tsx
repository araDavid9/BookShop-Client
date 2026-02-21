import { useState } from "react";
import type { Book } from "../services/BooksService.ts";
import {useCart} from "../context/CartContext.tsx";
import {type CartItem} from "../context/CartContext.tsx";

type Props = {
    book: Book;
    isLoggedIn: boolean;
}

function BookCard({ book, isLoggedIn }: Props) {
    const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
    const [isAdded, setIsAdded] = useState<boolean>(false);
    const {cart,addToCart} = useCart();

    const checkIfAvailableStock = () : boolean =>{
        const currentQuantityOfItemInCart = cart.find((i) => i.bookId === book.id);
        const amountInCart = currentQuantityOfItemInCart ? currentQuantityOfItemInCart.quantity : 0;
        return amountInCart + selectedQuantity > book.stock;

    }

    const handleAddToCart = () => {
        const isError = checkIfAvailableStock();
        if(isError){
            alert(`You cant add more than available stock! please check your cart)`);
            return;
        }

        const cartItem: CartItem = {
            bookId:book.id,
            bookName:book.name,
            quantity:selectedQuantity,
            price:book.price
        };

        addToCart(cartItem,book.stock);
        setIsAdded(true);
    };

    return (
        <div className="card h-100" style={{ width: "18rem" }}>
            {isAdded && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Success:</strong>{} {selectedQuantity} has been added.
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setIsAdded(false)}
                        aria-label="Close"
                    ></button>
                </div>
            )}

            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{book.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                    By: {book.author.name}
                </h6>
                <p className="card-text text-success fw-bold mb-2">
                    ${book.price.toFixed(2)}
                </p>
                <p className="card-text small text-muted mb-1">
                    Published by: {book.publisher.name}
                </p>
                <p className="card-text small">
                    <span className={book.stock > 0 ? "text-success" : "text-danger"}>
                        {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
                    </span>
                </p>

                {isLoggedIn && book.stock > 0 && (
                    <div className="mt-auto pt-3">
                        <div className="d-flex gap-2 align-items-center mb-2">
                            <label htmlFor={`quantity-${book.id}`} className="form-label mb-0 small">
                                Quantity:
                            </label>
                            <select
                                id={`quantity-${book.id}`}
                                className="form-select form-select-sm"
                                value={selectedQuantity}
                                onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                                style={{ width: "80px" }}
                            >
                                {Array.from({ length: Math.min(book.stock, 10) }, (_, i) => i + 1).map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            className="btn btn-primary w-100"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>

                    </div>
                )}

                {isLoggedIn && book.stock === 0 && (
                    <button className="btn btn-secondary w-100 mt-auto" disabled>
                        Out of Stock
                    </button>
                )}

                {!isLoggedIn && (
                    <div className="mt-auto pt-3">
                        <p className="text-muted small text-center mb-2">
                            Login to purchase
                        </p>
                    </div>
                )}
            </div>
        </div>

    );
}

export default BookCard;