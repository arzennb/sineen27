import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Role = "admin" | "employee";

export interface User {
  id: string;
  username: string;
  password?: string;
  role: Role;
}

interface AuthContextType {
  role: Role | null;
  currentUser: User | null;
  users: User[];
  login: (username: string, password?: string) => void;
  logout: () => void;
  addUser: (username: string, password?: string, role?: Role) => void;
  deleteUser: (id: string) => void;
  updatePassword: (oldPassword: string, newPassword: string) => void;
  setUserPassword: (userId: string, newPassword: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem("saneen_users");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    // Default admin
    return [{ id: "admin-1", username: "admin", password: "123", role: "admin" }];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("saneen_current_user");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return null;
  });

  useEffect(() => {
    localStorage.setItem("saneen_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("saneen_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("saneen_current_user");
    }
  }, [currentUser]);

  const login = (username: string, password?: string) => {
    const found = users.find(u => u.username === username && u.password === password);
    if (!found) throw new Error("Invalid credentials");
    setCurrentUser(found);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUser = (username: string, password?: string, role: Role = "employee") => {
    const newUser: User = { id: Date.now().toString(), username, password, role };
    setUsers(prev => [...prev, newUser]);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const updatePassword = (oldPassword: string, newPassword: string) => {
    if (!currentUser) throw new Error("غير مسجل الدخول");
    if (currentUser.password !== oldPassword) throw new Error("كلمة المرور القديمة غير صحيحة");
    
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, password: newPassword } : u));
    setCurrentUser(prev => prev ? { ...prev, password: newPassword } : null);
  };

  const setUserPassword = (userId: string, newPassword: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, password: newPassword } : u));
  };

  return (
    <AuthContext.Provider value={{ 
      role: currentUser?.role || null, 
      currentUser, 
      users, 
      login, 
      logout,
      addUser,
      deleteUser,
      updatePassword,
      setUserPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
