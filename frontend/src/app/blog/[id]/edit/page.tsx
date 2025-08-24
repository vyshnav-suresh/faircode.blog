"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import RichTextEditor from "@/components/common/RichTextEditor";
import api from "@/utils/axios";

export default function BlogEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBlog() {
      setFetching(true);
      try {
        const res = await api.get(`/blog/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (err: any) {
        setError("Failed to load blog post");
      } finally {
        setFetching(false);
      }
    }
    if (id) fetchBlog();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.put(`/blog/${id}`, { title, content });
      router.push(`/blog/${id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex justify-center py-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center py-10 px-2">
      <nav className="w-full max-w-2xl mx-auto px-2 pt-2 pb-2" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-blue-700 dark:text-blue-200">
          <li>
            <a href="/" className="hover:underline font-medium">Home</a>
          </li>
          <li aria-hidden className="mx-1">/</li>
          <li>
            <a href="/blog" className="hover:underline font-medium">Blog</a>
          </li>
          <li aria-hidden className="mx-1">/</li>
          <li className="truncate max-w-[120px] font-semibold text-gray-700 dark:text-white" title={title}>Edit</li>
        </ol>
      </nav>
      <div className="w-full max-w-2xl sticky top-0 z-10 mb-6">
        <div className="flex items-center gap-2 bg-white/95 dark:bg-gray-900/90 shadow rounded-t-xl px-4 py-3 border-b border-blue-200 dark:border-gray-800">
          <a href={`/blog/${id}`} className="text-blue-600 hover:underline font-semibold text-sm flex items-center gap-1">
            ← Back to Post
          </a>
          <span className="ml-auto text-lg font-bold text-blue-700 dark:text-blue-200">Edit Blog Post</span>
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
            {loading ? "Updating..." : "Update Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
