import { useAuth } from "@/store/AuthContext";

export function usePermission() {
  const { user } = useAuth();

  const can = (key) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(key);
  };

  return { can };
}
