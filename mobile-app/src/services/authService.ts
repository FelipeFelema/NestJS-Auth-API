import api from "../api/api";
import { saveTokens } from "../storage/authStorage";

export const login = async (email: string, password: string) => {
    console.log("Chamando API...")
    const response = await api.post("/auth/login", {
        email,
        password,
    });
    
    const { access_token, refresh_token } = response.data;

    await saveTokens(access_token, refresh_token);

    return {
        accessToken: access_token,
        refreshToken: refresh_token,
    };
};

export const register = async (name: string, email: string, password: string) => {
    return await api.post("/auth/register", {
        name,
        email,
        password
    });
}