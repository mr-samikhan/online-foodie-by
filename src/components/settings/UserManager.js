"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/store/AuthContext";
import bcrypt from "bcryptjs";

const ALL_PERMISSIONS = ["dashboard", "services", "settings", "orders"];

export default function UserManager() {
  const { user: currentUser, setUser: setAuthUser } = useAuth();
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
    if (!username || (!password && !editingId)) return;

    const hashedPassword = password ? bcrypt.hashSync(password, 10) : null;

    if (editingId) {
      // Update existing user
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

      // If the currently logged-in user was updated, update auth context too
      if (currentUser?.id === editingId) {
        const updatedCurrentUser = updatedUsers.find((u) => u.id === editingId);
        localStorage.setItem("user", JSON.stringify(updatedCurrentUser));
        setAuthUser(updatedCurrentUser);
      }

      setEditingId(null);
    } else {
      // Add new user
      const newUser = {
        id: Date.now().toString(),
        username,
        password: hashedPassword,
        role,
        permissions,
      };
      saveUsers([...users, newUser]);
    }

    // Reset form
    setUsername("");
    setPassword("");
    setRole("cashier");
    setPermissions(["dashboard", "services"]);
  };

  const deleteUser = (id) => {
    saveUsers(users.filter((u) => u.id !== id));

    // If deleting current user, log them out
    if (currentUser?.id === id) {
      localStorage.removeItem("user");
      setAuthUser(null);
    }

    if (editingId === id) setEditingId(null);
  };

  const editUser = (user) => {
    setEditingId(user.id);
    setUsername(user.username);
    setRole(user.role);
    setPermissions(user.permissions || []);
    setPassword(""); // leave blank for security
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-xl">
      <h2 className="text-xl font-bold mb-3">User Manager</h2>

      {/* Add / Edit User Form */}
      <div className="space-y-3 mb-4">
        <input
          placeholder="Username"
          className="border p-2 w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder={
            editingId ? "New Password (leave blank to keep)" : "Password"
          }
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="border p-2 w-full"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="cashier">Cashier</option>
          <option value="admin">Admin</option>
        </select>

        {/* Permissions */}
        <div>
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

        <button
          onClick={addOrUpdateUser}
          className={`w-full px-4 py-2 rounded text-white ${
            editingId ? "bg-yellow-600" : "bg-black"
          }`}
        >
          {editingId ? "Update User" : "Add User"}
        </button>
      </div>

      {/* User List */}
      <div className="space-y-2">
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
