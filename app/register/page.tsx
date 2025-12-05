"use client";

import { useState, FormEvent } from "react";
import { registerUser, loginWithGoogle } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { User as FirebaseUser } from "firebase/auth";

export default function RegisterPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const user: FirebaseUser = await registerUser(email, password);
      console.log("Registered user:", user);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error occurred");
    }
  }

  async function handleGoogleLogin() {
    setError("");
    try {
      const { user, role }: { user: FirebaseUser; role: string } = await loginWithGoogle();
      console.log("Google sign up:", user, "Role:", role);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error occurred");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Register</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
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
            Create Account
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-2">or</p>
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded font-semibold"
          >
            Sign up with Google
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-600 dark:text-gray-300 text-center">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
