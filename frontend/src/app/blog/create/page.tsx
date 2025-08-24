"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/common/RichTextEditor";
import api from "@/utils/axios";

export default function BlogCreatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/blog", { title, content });
      router.push("/blog");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center py-10 px-2">
      {/* Sticky header with back button */}
      <div className="w-full max-w-2xl sticky top-0 z-10 mb-6">
        <div className="flex items-center gap-2 bg-white/95 dark:bg-gray-900/90 shadow rounded-t-xl px-4 py-3 border-b border-blue-200 dark:border-gray-800">
          <a href="/blog" className="text-blue-600 hover:underline font-semibold text-sm flex items-center gap-1">
            ← Back to Blog
          </a>
          <span className="ml-auto text-lg font-bold text-blue-700 dark:text-blue-200">Create Blog Post</span>
        </div>
      </div>
      <div className="w-full max-w-2xl bg-white/95 dark:bg-gray-900/90 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">Title</label>
            <input
              type="text"
              className="w-full border-2 border-blue-200 dark:border-blue-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter your blog title..."
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">Content</label>
            <div className="rounded-lg border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-900 focus-within:ring-2 focus-within:ring-blue-400 transition">
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>
          {error && <div className="text-red-600 font-medium text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold text-lg shadow hover:from-blue-700 hover:to-blue-500 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
