"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        router.push("/login");
      } else {
        setUser(u);

        // קבלת כל המשתמשים אם זה admin
        const docRef = collection(db, "users");
        const snapshot = await getDocs(docRef);
        const usersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsersList(usersData);

        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) return null;

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <p>ברוך הבא, {user.email}</p>

      <h2 className="mt-6 text-xl font-bold">Users:</h2>
      <ul>
        {usersList.map((u) => (
          <li key={u.id}>
            {u.email} - Role: {u.role || "user"}
          </li>
        ))}
      </ul>
    </div>
  );
}
