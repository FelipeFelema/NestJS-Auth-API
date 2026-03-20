import axios from "axios";
import { getAccessToken, getRefreshToken, saveTokens } from "../storage/authStorage";

const api = axios.create({
    baseURL: "http://192.168.0.100:3000/api/v1",
    headers: {
        "Content-Type": "application/json",
    }
})

// Add a request interceptor to include the access token in the Authorization header
api.interceptors.request.use(async (config) => {
    const token = await getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})

// Auto refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = await getRefreshToken();

            try {
                const response = await axios.post(
                    'http://192.168.0.100:3000/api/v1/auth/refresh',
                    { refreshToken }
                );

                const { accessToken, refreshToken: newRefresh } = response.data;

                await saveTokens(accessToken, newRefresh);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                return api(originalRequest);
            } catch (err) {
                console.log("Refresh token failed");
            }
        }

        return Promise.reject(error);
    }
);

export default api;