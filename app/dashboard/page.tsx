"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { signOut, User as FirebaseUser } from "firebase/auth";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) {
        router.push("/login");
      } else {
        setUser(u);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6">ברוך הבא, {user?.email}</h1>

      <h2 className="text-xl font-semibold mb-4">התחלת פרסום:</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <button
          onClick={() => router.push("/marketing/facebook")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold"
        >
          Facebook
        </button>
        <button
          disabled
          className="bg-gray-400 cursor-not-allowed text-white px-6 py-3 rounded font-semibold"
        >
          Instagram (Coming Soon)
        </button>
        <button
          disabled
          className="bg-gray-400 cursor-not-allowed text-white px-6 py-3 rounded font-semibold"
        >
          TikTok (Coming Soon)
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
