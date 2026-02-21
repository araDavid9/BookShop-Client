import api from "../lib/api.ts";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthenticationResponse {
        id: string;
        email: string;
        username: string;
        role: number;
        token: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    username: string;
}

export const sendLoginReq = async (data : LoginRequest) : Promise<AuthenticationResponse> => {
    const response = await api.post<AuthenticationResponse>("/Auth/login", data);
    return response.data;
}

export const sendRegisterReq = async (regReq : RegisterRequest):Promise<AuthenticationResponse> =>{
    const response = await api.post<AuthenticationResponse>("/Auth/register", regReq);
    return response.data;
}