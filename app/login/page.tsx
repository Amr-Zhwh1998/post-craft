"use client";

import { useState, FormEvent } from "react";
import { loginUser, loginWithGoogle } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { User as FirebaseUser } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      const { user, role }: { user: FirebaseUser; role: string } = await loginUser(email, password);
      console.log("User logged in:", user, "Role:", role);
      if (role === "admin") router.push("/admin");
      else router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
    }
  }

  async function handleGoogle() {
    setError("");
    try {
      const { user, role }: { user: FirebaseUser; role: string } = await loginWithGoogle();
      console.log("Google login:", user, "Role:", role);
      if (role === "admin") router.push("/admin");
      else router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-2">or</p>
          <button
            onClick={handleGoogle}
            className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded font-semibold"
          >
            Login with Google
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-600 dark:text-gray-300 text-center">
          Dont have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}
