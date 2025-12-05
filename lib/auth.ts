import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// הרשמת משתמש רגיל
export async function registerUser(email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    role: "user", // ברירת מחדל
    createdAt: new Date(),
  });

  return user;
}

// Login רגיל + בדיקת Role
export async function loginUser(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // קבלת ה-role מה־Firestore
  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    // אם אין מסמך, יוצרים מסמך ברירת מחדל
    await setDoc(userDocRef, {
      email: user.email,
      role: "user",
      createdAt: new Date(),
    });
  }

  const role = userDocSnap.data()?.role || "user";
  console.log("LoginUser role:", role);

  return { user, role };
}

// Login עם Google + שמירת Role קיימת
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    // אם המשתמש חדש, יוצרים מסמך עם role ברירת מחדל
    await setDoc(userDocRef, {
      email: user.email,
      role: "user",
      createdAt: new Date(),
    });
  }

  const role = userDocSnap.data()?.role || "user";
  console.log("LoginWithGoogle role:", role);

  return { user, role };
}