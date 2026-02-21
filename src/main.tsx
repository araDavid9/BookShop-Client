import { createRoot } from 'react-dom/client'
import App from './components/App.tsx'
import {AuthProvider} from "./context/AuthContext.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import {CartProvider} from "./context/CartContext.tsx";
import {StrictMode} from "react";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <CartProvider>
                <App />
            </CartProvider>
        </AuthProvider>,
    </StrictMode>
)
