import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveTokens = async (acessToken: string, refreshToken: string) => {
    await AsyncStorage.setItem("accessToken", acessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
};

export const getAccessToken = async () => {
    return await AsyncStorage.getItem("accessToken");
}

export const getRefreshToken = async () => {
    return await AsyncStorage.getItem("refreshToken");
}

export const clearTokens = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
}   