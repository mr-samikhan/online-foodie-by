"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/store/AuthContext";
import bcrypt from "bcryptjs";
import { useToastStore } from "@/store/ToastStore";

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

  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cashier");
  const [permissions, setPermissions] = useState(["dashboard", "services"]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(saved);
  }, []);

  const saveUsers = (data) => {
    localStorage.setItem("users", JSON.stringify(data));
    setUsers(data);
  };

  const togglePermission = (perm) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const addOrUpdateUser = () => {
    if (!username || (!password && !editingId))
      return showToast("Fill required fields", "error");

    const hashedPassword = password ? bcrypt.hashSync(password, 10) : null;

    if (editingId) {
      const updatedUsers = users.map((u) =>
        u.id === editingId
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

      if (currentUser?.id === editingId) {
        const updatedCurrentUser = updatedUsers.find((u) => u.id === editingId);
        localStorage.setItem("user", JSON.stringify(updatedCurrentUser));
        setAuthUser(updatedCurrentUser);
      }

      showToast("User updated successfully", "success");
      setEditingId(null);
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

    setUsername("");
    setPassword("");
    setRole("cashier");
    setPermissions(["dashboard", "services"]);
  };

  const deleteUser = (id) => {
    saveUsers(users.filter((u) => u.id !== id));

    if (currentUser?.id === id) setAuthUser(null);
    if (editingId === id) setEditingId(null);

    showToast("User deleted", "info");
  };

  const editUser = (user) => {
    setEditingId(user.id);
    setUsername(user.username);
    setRole(user.role);
    setPermissions(user.permissions || []);
    setPassword("");
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-3">User Manager</h2>

      {/* Form */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4 flex-wrap">
        <input
          placeholder="Username"
          className="border p-2 flex-1"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder={editingId ? "New Password (leave blank)" : "Password"}
          type="password"
          className="border p-2 flex-1"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="border p-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="cashier">Cashier</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={addOrUpdateUser}
          className={`px-4 py-2 rounded text-white ${
            editingId ? "bg-yellow-600" : "bg-black"
          }`}
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* Permissions */}
      <div className="mb-4">
        <p className="font-semibold mb-2">Module Access</p>
        <div className="grid grid-cols-2 gap-2">
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
      </div>

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
                onClick={() => editUser(u)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteUser(u.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
