import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {sendRegisterReq,type RegisterRequest} from "../services/AuthService.ts";
import Navbar from "../components/navbar.component.tsx";


const Register = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errors, setErrors] = useState<{
        username?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});
    const [apiError, setApiError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const validate = (): boolean => {
        const newErrors: typeof errors = {};

        if (!username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setApiError("");

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        const regRequest: RegisterRequest = { username, email, password };

        try {
            await sendRegisterReq(regRequest);
            alert("Registration successful! please login");
            navigate("/login");
        } catch (err: any) {
            if (err.response?.status === 400) {
                setApiError(err.response.data.message || "Check You Details! maybe you already have a user");
            } else {
                setApiError("Registration failed. Please try again.");
            }
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container vh-100 d-flex justify-content-center align-items-center">
                <div className="card p-4 shadow" style={{ width: "450px" }}>
                    <h2 className="card-title text-center mb-3">Create Account</h2>
                    { apiError && <div className="alert alert-danger">{apiError}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    if (errors.username) {
                                        setErrors({...errors, username: undefined});
                                    }
                                }}
                            />
                            {errors.username && (
                                <div className="invalid-feedback">{errors.username}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>

                            <input
                                type="email"
                                id="email"
                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) {
                                        setErrors({...errors, email: undefined});
                                    }
                                }}
                            />

                            {errors.email && (
                                <div className="invalid-feedback">{errors.email}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) {
                                        setErrors({...errors, password: undefined});
                                    }
                                }}
                            />
                            {errors.password && (
                                <div className="invalid-feedback">{errors.password}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (errors.confirmPassword) {
                                        setErrors({...errors, confirmPassword: undefined});
                                    }
                                }}
                            />
                            {errors.confirmPassword && (
                                <div className="invalid-feedback">{errors.confirmPassword}</div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating account..." : "Register"}
                        </button>
                    </form>

                    <div className="text-center mt-3">
                        <p className="text-muted small">
                            Already have an account?{" "}
                            <Link to="/login" className="text-decoration-none">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;