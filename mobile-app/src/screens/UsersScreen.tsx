import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getUsers, updateUser, deleteUser } from "../services/userService";
import { clearTokens } from "../storage/authStorage";
import { showAlert } from "../utils/alert";

interface UsersScreenProps {
  onLogout: () => void;
  onGoToProfile: () => void;
}

export default function UsersScreen({
  onLogout,
  onGoToProfile,
}: UsersScreenProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      const err = error as any;

        console.log(err.response?.data);
        console.log(err.message)

        const message = 
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Error loading users"

        showAlert("Error", message)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function handleEdit(user: any) {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
  }

  async function handleSaveEdit() {
    if (!editingUser) return;

    try {
      const dataToUpdate: any = { name, email };

      if (password) {
        dataToUpdate.password = password;
      }

      const updatedUser = await updateUser(editingUser.id, dataToUpdate);

      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? updatedUser : u))
      );

      setEditingUser(null);
      setPassword("");

      showAlert("Success", "User updated successfully");
    } catch (error) {
        const err = error as any;

        console.log(err.response?.data);
        console.log(err.message)

        const message = 
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Error updating user"

        showAlert("Error", message)
    }
  }

  function handleDelete(id: string) {
    showAlert(
      "Delete User",
      "This action cannot be undone. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUser(id);

              setUsers((prev) => prev.filter((u) => u.id !== id));

              showAlert("Success", "User deleted");
            } catch (error) {
                const err = error as any;

                console.log(err.response?.data);
                console.log(err.message)

                const message = 
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Error deleting user"

                showAlert("Error", message)
            }
          },
        },
      ]
    );
  }

  async function handleLogout() {
    await clearTokens();
    onLogout();
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={onGoToProfile}>
          <Text style={styles.headerText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.headerText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {editingUser && (
        <View style={styles.editCard}>
          <Text style={styles.editTitle}>Editing User</Text>

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
            placeholder="New Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />

          <TouchableOpacity style={styles.editButton} onPress={handleSaveEdit}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setEditingUser(null)}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.userInfo}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.role}>{item.role}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    padding: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  headerButton: {
    backgroundColor: "#4f46e5",
    padding: 10,
    borderRadius: 8,
  },

  logoutButton: {
    backgroundColor: "#dc2626",
    padding: 10,
    borderRadius: 8,
  },

  headerText: {
    color: "#fff",
    fontWeight: "bold",
  },

  editCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },

  editTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
  },

  input: {
    backgroundColor: "#f1f3f5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  cancelButton: {
    marginTop: 10,
    alignItems: "center",
  },

  cancelText: {
    color: "#4f46e5",
    fontWeight: "500",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },

  userInfo: {
    marginBottom: 10,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
  },

  email: {
    color: "#666",
    marginTop: 2,
  },

  role: {
    marginTop: 5,
    fontSize: 12,
    color: "#4f46e5",
    fontWeight: "bold",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  editButton: {
    backgroundColor: "#4f46e5",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },

  deleteButton: {
    backgroundColor: "#dc2626",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});