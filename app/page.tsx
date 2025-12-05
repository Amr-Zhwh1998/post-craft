"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">ברוכים הבאים ל-Post Craft</h1>
      <p className="text-lg mb-6">בחר מה לעשות:</p>

      <div className="flex space-x-4">
        <Link
          href="/register"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
        >
          Register
        </Link>
        <Link
          href="/login"
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
