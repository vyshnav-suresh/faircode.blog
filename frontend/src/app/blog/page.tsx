import React from "react";
import Link from "next/link";
import api from "@/utils/axios";

// Disable static prerendering at build time and always fetch at request time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  createdBy: { username: string };
  createdAt: string;
  createdAtFormatted?: string;
}

function stripAndTruncate(html: string, maxLen: number): string {
  // Remove HTML tags
  const text = html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, ' ');
  return text.length > maxLen ? text.slice(0, maxLen).trim() + "..." : text;
}

async function getBlogPosts(): Promise<{data: BlogPost[],page:number,limit:number,total:number,totalPages:number}> {
  try {
    const res = await api.get(`/blog`);
    return res.data;
  } catch (err) {
    // On build-time or server-side errors (e.g., backend down), return an empty list gracefully
    return { data: [], page: 1, limit: 10, total: 0, totalPages: 0 };
  }
}

export default async function BlogListPage() {  
  const posts: {data: BlogPost[],page:number,limit:number,total:number,totalPages:number} = await getBlogPosts();
  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      {/* Hero Section */}
      <section className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-400 to-sky-400 bg-clip-text text-transparent mb-3 tracking-tight drop-shadow-lg">FairCode Blog</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">Insights, stories, and updates from our community.</p>
        <Link href="/blog/create" className="inline-block bg-gradient-to-r from-blue-600 to-sky-500 text-white px-6 py-3 rounded-full font-semibold shadow hover:scale-105 transition-transform">+ New Post</Link>
      </section>
      {/* Blog Cards */}
      <ul className="grid md:grid-cols-2 gap-8">
        {posts.total === 0 && (
          <li className="text-gray-500 col-span-full text-center">No posts found.</li>
        )}
        {posts.data.map(post => (
          <li key={post._id} className="group border rounded-2xl p-6 bg-white/90 dark:bg-gray-900/90 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer">
            <Link href={`/blog/${post._id}`}
              className="block h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl shadow-inner">
                  {post.createdBy.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="block font-semibold text-gray-800 dark:text-gray-100">{post.createdBy.username}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                {post.createdAt && (new Date(post.createdAt)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-blue-700 group-hover:underline mb-2 line-clamp-2">{post.title}</h2>
              <p className="text-gray-700 dark:text-gray-300 text-base line-clamp-3 mb-1">
                {post.content ? stripAndTruncate(post.content, 100) : ''}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
