import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// ۱. تعریف تایپ برای آبجکت کاربر
// این تایپ را بر اساس ساختار واقعی آبجکت user خودتان تنظیم کنید
interface User {
  id: number;
  name: string;
  username: string;
  roles?: string[]; // roles ممکن است وجود نداشته باشد
}

// ۲. تعریف تایپ برای مقادیری که Context فراهم می‌کند
interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// ۳. ساخت Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ۴. ساخت Provider (کامپوننت اصلی)
export function AuthProvider({ children }: { children: ReactNode }) {
  // --- State‌ها ---
  // خواندن توکن از localStorage در اولین بارگذاری
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  // خواندن اطلاعات کاربر از localStorage در اولین بارگذاری
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    // برای جلوگیری از خطا اگر دیتای localStorage خراب بود، از try-catch استفاده می‌کنیم
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });


  // --- Effect‌ها برای همگام‌سازی ---
  // این Effect هر زمان توکن یا کاربر تغییر کند، localStorage را به‌روز می‌کند
  useEffect(() => {
    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      // اگر یکی از آن‌ها null بود، هر دو را پاک می‌کنیم تا وضعیت هماهنگ بماند
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token, user]);


  // --- توابع اصلی ---
  // تابع login حالا هم توکن و هم کاربر را دریافت و ذخیره می‌کند
  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  // تابع logout هر دو state توکن و کاربر را پاک می‌کند
  const logout = () => {
    setToken(null);
    setUser(null);
  };


  // --- متغیر مشتق‌شده (Derived State) ---
  // متغیر isAuthenticated بر اساس وجود توکن محاسبه می‌شود
  const isAuthenticated =
    !!token &&
    token !== "undefined" &&
    token !== "null" &&
    token.length > 10;


  // --- ارائه کردن مقادیر به کامپوننت‌های فرزند ---
  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}


// ۵. هوک سفارشی برای استفاده آسان از Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}