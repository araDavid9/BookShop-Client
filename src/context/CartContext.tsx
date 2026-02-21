import { createContext, useContext, useState, type ReactNode } from "react";

export interface CartItem {
    bookId: string;
    bookName: string;
    quantity: number;
    price: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem,itemStock: number) => void;
    removeFromCart: (bookId: string) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const addToCart = (item: CartItem,itemStock:number) => {
        setCart((prevCart : CartItem[]  ) : CartItem[] => {
            const existingItem = prevCart.find((i) => i.bookId === item.bookId);

            const currentItemQuantityInCart = existingItem ? existingItem?.quantity : 0;
            const newTotalQuantity = currentItemQuantityInCart + item.quantity;
            if(newTotalQuantity > itemStock)
            {
                return prevCart ;
            }

            let newCart;
            if (existingItem) {
                newCart = prevCart.map((i) =>
                    i.bookId === item.bookId
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            } else {
                newCart = [...prevCart, item];
            }

            localStorage.setItem("cart", JSON.stringify(newCart));
            return newCart;
        });
    };

    const removeFromCart = (bookId: string) => {
        setCart((prevCart) => {
            const newCart = prevCart.filter((item) => item.bookId !== bookId);
            localStorage.setItem("cart", JSON.stringify(newCart));
            return newCart;
        });
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                getTotalItems,
                getTotalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};