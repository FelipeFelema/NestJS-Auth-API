import { useEffect, useState } from "react";
import { View, Text, Button, TextInput } from "react-native";
import { deleteUser, getMe, updateUser } from "../services/userService";
import { clearTokens } from "../storage/authStorage";
import { StyleSheet } from "react-native";

interface ProfileScreenProps {
    onLogout: () => void;
    onGoToUsers: () => void;
}

export default function ProfileScreen({onLogout, onGoToUsers }: ProfileScreenProps) {
    const [user, setUser ] = useState<any>(null);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        loadUser();
    },[]);

    async function loadUser() {
        const data = await getMe();
        setUser(data);

        setName(data.name);
        setEmail(data.email);
    }

    async function handleUpdate() {
        try {
            const updated = await updateUser(user.id, {
                name,
                email,
            });

            setUser(updated)
            setEditing(false);

        } catch (error) {
            console.log("Error updating", error)
        }

    }

    async function handleDelete() {
        try {
            await deleteUser(user.id);

            await clearTokens();

            onLogout();
        } catch (error) {
            console.log("Error deleting", error);
        }
    }

    if (!user) return <Text>Loading...</Text>;

    return (
        <View>
            <Text>Perfil</Text>

            {editing ? (
                <View>
                    <TextInput value={name} onChangeText={setName} style={styles.input} />
                    <TextInput value={email} onChangeText={setEmail} style={styles.input} />

                    <Button title="Save" onPress={handleUpdate} />
                    <Button
                        title="Cancel"
                        onPress={() => {
                            setEditing(false);
                            setName(user.name)
                            setEmail(user.email);
                        }}
                    />
                </View>
            ) : (
                <View>
                    <Text>Name: {user.name}</Text>
                    <Text>Email: {user.email}</Text>
                    <Text>Role: {user.role}</Text>

                    <Button title="Edit" onPress={() => setEditing(true)} />
                    <Button title="Delete account" onPress={handleDelete} />

                    {user.role === "ADMIN" && (
                        <Button
                            title="Manage users"
                            onPress={onGoToUsers}
                        />
                    )}

                    <Button title="Logout" onPress={onLogout} />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    }
})