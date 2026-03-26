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
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null >(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);

  async function loadUsers() {
    try {
      setLoading(true);
      const response = await getUsers({
        page,
        limit,
        ...(search ? { search } : {}),
      });

      setUsers(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setHasNextPage(response.hasNextPage);

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
  }, [page, limit]);

  function handleEdit(user: any) {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
  }

  async function handleSaveEdit() {
    if (!editingUser) return;

    try {
      setSaving(true);
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
    } finally {
      setSaving(false)
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
              setDeletingId(id);
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
            } finally {
              setDeletingId(null);
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
          
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.cancelButtonFixed}
              onPress={() => setEditingUser(null)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButtonFixed,
                saving && styles.disabledButton
              ]}
              onPress={handleSaveEdit}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.searchContainer}>
        <Text style={styles.searchLabel}>Search Users</Text>

        <TextInput
        placeholder="Search by email..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => {
          setPage(1);
          loadUsers();
        }}
      >
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      </View>
      
  <View style={styles.limitContainer}>
      <Text style={styles.limitLabel}>Items per page</Text>

  <View style={styles.limitButtonsRow}>
    {[10, 20, 50].map((value) => (
      <TouchableOpacity
        key={value}
        onPress={() => {
          setLimit(value)
          setPage(1)
        }}
        style={[
          styles.limitButton,
          limit === value && styles.limitButtonActive,
        ]}
      >
        <Text
          style={[
            styles.limitText,
            limit === value && styles.limitTextActive,
          ]}
        >
          {value}
        </Text>
      </TouchableOpacity>
    ))}
    </View>
  </View>

      <Text style={styles.totalText}>
        Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total}
      </Text>

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
                disabled={deletingId === item.id}
              >
                {deletingId === item.id ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

        <View style={styles.pagination}>
          <TouchableOpacity
            style={[
              styles.pageButton,
              page === 1 && styles.disabledButton
            ]}
            disabled={page === 1}
            onPress={() => setPage((p) => p - 1)}
          >
            <Text style={styles.pageText}>Previous</Text>
          </TouchableOpacity>

          <Text style={styles.pageIndicator}>Page {page} of {totalPages}</Text>

          <TouchableOpacity
            style={[
              styles.pageButton,
              !hasNextPage && styles.disabledButton
            ]}
            disabled={!hasNextPage}
            onPress={() => setPage((p) => p + 1)}
          >
            <Text style={styles.pageText}>Next</Text>
          </TouchableOpacity>
        </View>

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
    width: "100%",
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

  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
  },

  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#4f46e5",
  },

disabledButton: {
    backgroundColor: "#a5b4fc",
  },

pageText: {
    color: "#fff",
    fontWeight: "bold",
  },

pageIndicator: {
    fontWeight: "bold",
    color: "#333",
  },

  searchContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },

  searchButton: {
    backgroundColor: "#4f46e5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },

  searchLabel: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 14,
    color: "#333",
  },

  limitContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },

  limitButton: {
    width: "30%",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#e5e7eb",
  },

  limitButtonActive: {
    backgroundColor: "#4f46e5",
  },

  limitText: {
    fontWeight: "bold",
    color: "#333",
  },

  limitTextActive: {
    color: "#fff",
  },

  limitLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },

  limitButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  editActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  saveButtonFixed: {
    flex: 1,
    backgroundColor: "#4f46e5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  cancelButtonFixed: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  cancelText: {
    color: "#333",
    fontWeight: "bold",
  },

  totalText: {
    marginBottom: 10,
    fontWeight: "bold",
    color: "#333",
  },
});