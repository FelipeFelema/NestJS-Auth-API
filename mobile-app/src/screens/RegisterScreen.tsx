import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import api from "../api/api";

interface RegisterScreenProps {
    onRegisterSuccess: () => void;
}

export default function RegisterScreen({ onRegisterSuccess }: RegisterScreenProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleRegister() {
        try {
            console.log('Registrando...');

            await api.post("/auth/register", {
                name,
                email,
                password,
            });

            Alert.alert("User Created Successfully!");

            onRegisterSuccess();

        } catch (error) {
            const err = error as any;
            console.log(err.response?.data);
            console.log(err.message)

            Alert.alert("Error registering")
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

            <Button title="Register" onPress={handleRegister} />
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
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
})