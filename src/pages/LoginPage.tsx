import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { type LoginRequest, sendLoginReq } from "../services/AuthService.ts";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navbar.component.tsx";

const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [apiError, setApiError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const validate = (): boolean => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }

        if (!password) {
            newErrors.password = "Password is required";
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
        const credentials: LoginRequest = { email, password };

        try {
            const data = await sendLoginReq(credentials);
            login(data);
            navigate("/");
        } catch (err) {
            setApiError("Invalid email or password");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container vh-100 d-flex justify-content-center align-items-center">
                <div className="card p-4 shadow" style={{ width: "400px" }}>
                    <h2 className="card-title text-center mb-3">Login</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="text"
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

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Logging in..." : "Login"}
                        </button>
                        {apiError && <div className="alert alert-danger">{apiError}</div>}
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;