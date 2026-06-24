"use client"; // इसे क्लाइंट कंपोनेंट बनाना ज़रूरी है ताकि localStorage एक्सेस हो सके
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/Components/Navbar";

export default function MainLayout({ children }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token"); 

      if (!token) {
    
        router.push("/login");
      } else {
        setIsAuth(true);
      }
    }
  }, [router]);

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}