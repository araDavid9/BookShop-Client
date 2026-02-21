import {createContext, useContext, useState, type ReactNode} from "react";
import {type AuthenticationResponse} from "../services/AuthService.ts"


interface User {
    id: string;
    email: string;
    username: string;
    role: number;
}

interface AuthContextType {
    user: User | null;
    login: (loginRes :AuthenticationResponse) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(()=> {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    })

    const login = (loginRes :AuthenticationResponse) => {
        const currentUser : User = {
            id:loginRes.id,
            email: loginRes.email,
            username:loginRes.username,
            role:loginRes.role
        }

        setUser(currentUser);
        localStorage.setItem("token", loginRes.token);
        localStorage.setItem("user", JSON.stringify(currentUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within AuthProvider");

    return context;
};
