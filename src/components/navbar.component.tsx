import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import {useCart} from "../context/CartContext.tsx";


enum Role{
    User = 1,
    Admin = 2,
}
const Navbar = () => {
    const { user, logout } = useAuth();
    const {getTotalItems} = useCart();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">BookShop</Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Books</Link>
                        </li>

                        {user ? (
                            <>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/orders">My Orders</Link>
                                </li>

                                {user.role === Role.Admin && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/admin">Admin Dashboard</Link>
                                    </li>
                                )}

                                <li className="nav-item">
                                    <Link className="nav-link position-relative" to="/cart">
                                        Cart
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {getTotalItems()}
                                        </span>
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <button
                                        className="nav-link btn btn-link"
                                        onClick={logout}
                                    >
                                        {`Logout from ${user.username}`}
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;