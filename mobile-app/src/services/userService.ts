import api from "../api/api";

export async function getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
}) {
    const cleanParams: any = {};

    if (params?.page) cleanParams.page = params.page;
    if (params?.limit) cleanParams.limit = params.limit;
    if (params?.search) cleanParams.search = params.search;

    const response = await api.get("/users", {
        params: cleanParams,
    });

    return response.data;
}
   
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

