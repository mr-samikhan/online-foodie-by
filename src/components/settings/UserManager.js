"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/store/AuthContext";
import bcrypt from "bcryptjs";
import { useToastStore } from "@/store/ToastStore";
import { useConfirmStore } from "@/store/useConfirmStore";

const ALL_PERMISSIONS = [
  "dashboard",
  "services",
  "settings",
  "orders",
  "users",
];

export default function UserManager() {
  const { user: currentUser, setUser: setAuthUser } = useAuth();
  const { showToast } = useToastStore();
  const { showConfirm } = useConfirmStore();

  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // modal editing
  const [showModal, setShowModal] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cashier");
  const [permissions, setPermissions] = useState(["dashboard", "services"]);

  /* ---------------- LOAD USERS ---------------- */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(saved);
  }, []);

  const saveUsers = (data) => {
    localStorage.setItem("users", JSON.stringify(data));
    setUsers(data);
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setUsername(user.username);
      setRole(user.role);
      setPermissions(user.permissions || []);
      setPassword("");
    } else {
      setEditingUser(null);
      setUsername("");
      setRole("cashier");
      setPermissions(["dashboard", "services"]);
      setPassword("");
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const togglePermission = (perm) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const addOrUpdateUser = () => {
    if (!username || (!password && !editingUser))
      return showToast("Fill required fields", "error");

    const hashedPassword = password ? bcrypt.hashSync(password, 10) : null;

    if (editingUser) {
      const updatedUsers = users.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              username,
              role,
              permissions,
              password: password ? hashedPassword : u.password,
            }
          : u
      );

      saveUsers(updatedUsers);

      if (currentUser?.id === editingUser.id) {
        const updatedCurrentUser = updatedUsers.find(
          (u) => u.id === editingUser.id
        );
        localStorage.setItem("user", JSON.stringify(updatedCurrentUser));
        setAuthUser(updatedCurrentUser);
      }

      showToast("User updated successfully", "success");
    } else {
      const newUser = {
        id: Date.now().toString(),
        username,
        password: hashedPassword,
        role,
        permissions,
      };
      saveUsers([...users, newUser]);
      showToast("User added successfully", "success");
    }

    closeModal();
  };

  const deleteUser = (id) => {
    saveUsers(users.filter((u) => u.id !== id));

    if (currentUser?.id === id) setAuthUser(null);
    if (editingUser?.id === id) closeModal();

    showToast("User deleted", "info");
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-3">User Manager</h2>

      <button
        onClick={() => openModal()}
        className="bg-black text-white px-4 py-2 rounded mb-4"
      >
        Add New User
      </button>

      {/* User List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <div>
              <p className="font-semibold">{u.username}</p>
              <p className="text-sm text-gray-500">Role: {u.role}</p>
              <p className="text-xs text-gray-400">
                Access: {u.permissions?.join(", ")}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openModal(u)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  showConfirm({
                    title: "Delete User",
                    message: "Are you sure you want to delete this user?",
                    onConfirm: () => deleteUser(u.id),
                  })
                }
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-96 relative">
            <h3 className="text-lg font-bold mb-4">
              {editingUser ? "Update User" : "Add User"}
            </h3>

            <input
              placeholder="Username"
              className="border p-2 w-full mb-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              placeholder={editingUser ? "New Password" : "Password"}
              type="password"
              className="border p-2 w-full mb-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <select
              className="border p-2 w-full mb-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="cashier">Cashier</option>
              <option value="admin">Admin</option>
            </select>

            <p className="font-semibold mb-1">Module Access</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {ALL_PERMISSIONS.map((p) => (
                <label key={p} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={permissions.includes(p)}
                    onChange={() => togglePermission(p)}
                  />
                  <span className="capitalize">{p}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  showConfirm({
                    title: editingUser ? "Confirm Update" : "Confirm Add",
                    message: editingUser
                      ? "Are you sure you want to update this user?"
                      : "Are you sure you want to add this user?",
                    onConfirm: addOrUpdateUser,
                  })
                }
                className={`px-4 py-2 rounded text-white ${
                  editingUser ? "bg-yellow-600" : "bg-black"
                }`}
              >
                {editingUser ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
