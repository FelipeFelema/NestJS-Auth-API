import api from "../api/api";

export const getUsers = async () => {
    const response = await api.get("/users");
    return response.data.data;
};

export const getMe = async () => {
    const response = await api.get("/users/me")
    return response.data;
}

export const updateUser = async (id: string, data: any) => {
    const response = await api.patch (`/users/${id}`, data);
    return response.data
};

export const deleteUser = async (id: string) => {
    return await api.delete(`/users/${id}`);
};

