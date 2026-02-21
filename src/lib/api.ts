import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
    user: {
        id: number;
        email: string;
        username: string;
        role: string;
    };
    token: string;
}

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;