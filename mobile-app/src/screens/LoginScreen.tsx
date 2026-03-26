import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { saveTokens } from "../storage/authStorage";
import { login } from "../services/authService";
import { getMe } from "../services/userService";
import { showAlert } from "../utils/alert";


interface LoginScreenProps {
    onLoginSuccess: (screen: string) => void;
    onGoToRegister: () => void;
}

export default function LoginScreen({ onLoginSuccess, onGoToRegister }: LoginScreenProps) {
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ loading, setLoading] = useState(false);

    async function handleLogin() {
        try {
            setLoading(true);

            const { accessToken, refreshToken } = await login(email, password);
            
            await getMe();

            showAlert("Success",
                "Login successfully",
                [
                    {
                        text: "OK",
                        onPress: () => onLoginSuccess("profile"),
                    },
                ]
            );

        } catch (error) {
            const err = error as any;

            console.log(err.response?.data);
            console.log(err.message)

            const message = 
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Error loggin in"

            showAlert("Error", message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Login to your account</Text>

                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    placeholderTextColor="#999"
                />

                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                    placeholderTextColor="#999"
                />

                <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >    
                    {loading ? (
                        <ActivityIndicator color='#fff' />
                    ) : (
                        <Text style={styles.buttonText}>Login</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={onGoToRegister}>
                    <Text style={styles.link}>
                        Don't have an account? Create one
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6f8",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    card: {
        width: "100%",
        maxWidth: 400,
        backgroundColor: "#fff",
        padding: 25,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },

    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
    },

    subtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 25,
        textAlign: "center",
    },

    input: {
        backgroundColor: "#f1f3f5",
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
    },

    button: {
        backgroundColor: "#4f46e5",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
        justifyContent: "center"
    },

    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },

    buttonDisabled: {
        opacity: 0.7,
    },

    link: {
        marginTop: 15,
        textAlign: "center",
        color: "#4f46e5",
        fontSize: 14,
    },
});