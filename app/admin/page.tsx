// app/admin/page.tsx
"use client";

export const dynamic = "force-dynamic"; // <- חשוב כדי למנוע prerender

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";

interface AppUser {
  id: string;
  email: string | null;
  role?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [usersList, setUsersList] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        router.push("/login");
      } else {
        setUser(u);

        const usersCollection = collection(db, "users");
        const snapshot = await getDocs(usersCollection);
        const usersData: AppUser[] = snapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            email: doc.data().email ?? null,
            role: doc.data().role,
          })
        );
        setUsersList(usersData);

        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div style={{ padding: 20 }}>
      <h1>Hi Admin</h1>
      <p>ברוך הבא, {user.email}</p>

      <h2 className="mt-6 text-xl font-bold">Users:</h2>
      <ul>
        {usersList.map((u) => (
          <li key={u.id}>
            {u.email} - Role: {u.role ?? "user"}
          </li>
        ))}
      </ul>
    </div>
  );
}
