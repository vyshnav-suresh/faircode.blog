import React from "react";
import { formatLongDate } from "@/utils/date";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  createdBy: { username: string };
  createdAt: string;
  updatedAt: string;
  createdAtFormatted?: string;
}

interface BlogDetailComponentProps {
  post: BlogPost | null;
}

function EditButton({ post }: { post: BlogPost & { edit?: boolean } }) {
  if (!post.edit) return null;
  return (
    <a
      href={`/blog/${post._id}/edit`}
      className="inline-flex items-center px-4 py-2 rounded-lg bg-white/80 text-blue-700 font-semibold shadow hover:bg-blue-50 transition border border-blue-200 ml-4 mt-1"
    >
      Edit
    </a>
  );
}

export default function BlogDetailComponent({ post }: BlogDetailComponentProps) {
  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-gray-500 text-xl">Blog post not found.</div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 pb-16">
      <nav className="max-w-4xl mx-auto px-4 pt-6 pb-2" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-blue-700 dark:text-blue-200">
          <li>
            <a href="/" className="hover:underline font-medium">Home</a>
          </li>
          <li aria-hidden className="mx-1">/</li>
          <li>
            <a href="/blog" className="hover:underline font-medium">Blog</a>
          </li>
          <li aria-hidden className="mx-1">/</li>
          <li className="truncate max-w-[180px] font-semibold text-gray-700 dark:text-white" title={post.title}>{post.title}</li>
        </ol>
      </nav>
      <section className="w-full bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-900 dark:to-blue-700 py-12 mb-8 shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-start mb-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
              {post.title}
            </h1>
            <EditButton post={post} />
          </div>
          <div className="flex items-center gap-3 text-blue-100 text-base mb-2">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20 text-white font-bold text-lg shadow">
              {post.createdBy.username.charAt(0).toUpperCase()}
            </span>
            <span className="font-semibold">{post.createdBy.username}</span>
            <span aria-hidden className="mx-1">•</span>
            <span>{post.createdAtFormatted}</span>
          </div>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-4">
        <div className="prose prose-lg dark:prose-invert bg-white/95 dark:bg-gray-900/90 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </div>
  );
}
