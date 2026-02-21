import LoginPage from "../pages/LoginPage.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage.tsx";
import OrdersPage from "../pages/OrdersPage.tsx";
import CartPage from "../pages/CartPage.tsx";
import AdminDashboard from "../pages/AdminDashboard.tsx";
import RegisterPage from "../pages/RegisterPage.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/cart" element={<CartPage />}/>
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </Router>
    );
}

export default App
