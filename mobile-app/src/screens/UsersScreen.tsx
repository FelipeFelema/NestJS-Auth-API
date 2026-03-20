import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button, TextInput } from "react-native";
import { getUsers, updateUser, deleteUser } from "../services/userService";
import { Alert } from "react-native";
import { clearTokens } from "../storage/authStorage";

interface UsersScreenProps {
    onLogout: () => void;
    onGoToProfile: () => void;
}

export default function UsersScreen({ onLogout, onGoToProfile }: UsersScreenProps) {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState(""); 

    useEffect(() => {
        async function loadUsers() {
            try {
                console.log("Searching users");
                const data = await getUsers();
                console.log("Users:", data)

                setUsers(data);
            } catch (error) {
                console.log("Error searching for users:", error);
            }
        }

        loadUsers();
    },[]);

    async function handleEdit(user: any) {
        setEditingUser(user);
        setName(user.name);
        setEmail(user.email);
    }

    async function handleSaveEdit() {
        try {
            if (!editingUser) return;

            const updatedUser = await updateUser(editingUser.id, {
                name,
                email
            });

            setUsers((prevUsers: any) =>
                prevUsers.map((u: any) =>
                    u.id === editingUser.id ? updatedUser : u
                )
            );

            setEditingUser(null);

        } catch (error) {
            console.log("Error updating user", error);
        }
    }

    async function handleDelete(id: string) {
        await confirmDelete(id);
    }

    async function confirmDelete(id: string) {
        try {
            await deleteUser(id);

            setUsers((prevUsers: any) =>
                prevUsers.filter((user: any) => user.id !== id)
            );

        } catch (error) {
            console.log("Error deleting", error);
        }
    }

    async function handleLogout() {
        await clearTokens();
        onLogout();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Users</Text>
            <Button title="Logout" onPress={handleLogout} />
            <Button title="Back to Profile" onPress={onGoToProfile} />

            {editingUser && (
                <View style={styles.editContainer}>
                <Text>Editing User</Text>

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

                <Button title="Save" onPress={handleSaveEdit} />
                <Button title= "Cancel" onPress={() => setEditingUser(null)} />
                </View>
            )}

            <FlatList
                data={users}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item }: any) => (
                    <View style={styles.user}>
                        <Text>Name: {item.name}</Text>
                        <Text>Email: {item.email}</Text>
                        <Text>Role: {item.role}</Text>
                        <Text>ID: {item.id}</Text>

                        <Button
                            title="Edit"
                            onPress={() => handleEdit(item)}
                        />

                        <Button
                            title="Delete"
                            onPress={() => {
                                handleDelete(item.id)
                            }}
                        />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    user: {
        padding: 10,
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 5,
    },
    editContainer: {
        padding: 10,
        borderWidth: 1,
        marginBottom: 20,
        borderRadius: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    }
});