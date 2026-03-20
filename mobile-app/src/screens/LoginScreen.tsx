import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import api from "../api/api";
import { saveTokens } from "../storage/authStorage";
import { login } from "../services/authService";
import { getMe } from "../services/userService";


interface LoginScreenProps {
    onLoginSuccess: (screen: string) => void;
    onGoToRegister: () => void;
}

export default function LoginScreen({ onLoginSuccess, onGoToRegister }: LoginScreenProps) {
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    async function handleLogin() {
        console.log("Tentando Login...")
        try {
            const { accessToken, refreshToken } = await login(email, password);
            
            await saveTokens(accessToken, refreshToken);
            
            const user = await getMe();

            Alert.alert("Login successful");

            onLoginSuccess("profile");

        } catch (error) {
            console.log("COMPLETE ERROR", error);

            const err = error as any;
            console.log("RESPONSE", err.response);
            console.log("DATA", err.response?.data);
            console.log("MESSAGE", err.message);

            Alert.alert("Login failed");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <Button title='Login' onPress={handleLogin} />
            <Button title = "Create account" onPress={() => onGoToRegister()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 28,
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    }
})