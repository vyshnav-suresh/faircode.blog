"use client"
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-xl text-blue-600 dark:text-blue-400">faircode.blog</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/" className="hover:underline text-gray-700 dark:text-gray-200">Home</Link>
        <Link href="/blog" className="hover:underline text-gray-700 dark:text-gray-200">Blog</Link>
        {status === "authenticated" ? (
          <>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
