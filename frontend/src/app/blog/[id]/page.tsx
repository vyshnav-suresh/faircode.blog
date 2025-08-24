"use server"
import React from "react";
import { notFound } from "next/navigation";
import BlogDetailComponent from "@/components/blog/BlogDetailComponent";
import { getAccessTokenSSR } from "@/utils/getAccessTokenSSR";
import { format } from "date-fns";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  createdBy: { username: string };
  createdAt: string;
  updatedAt: string;
  createdAtFormatted?: string;
}



async function getBlogPost(id: string): Promise<BlogPost | null> {
  console.log("getBlogPost", id);
  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"}/blog/${id}`;
    const headers: Record<string, string> = {};
    const res = await fetch(url, { cache: "no-store", headers });
    if (!res.ok) return null;
    const data = await res.json();
    // Format date on server for hydration match
    data.createdAtFormatted = format(new Date(data.createdAt), "PPP p");
    return data as BlogPost;
  } catch {
    return null;
  }
}

export default async function BlogDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const post = await getBlogPost(id);
  console.log("post", post);

  if (!post) {
    notFound();
  }
  return <BlogDetailComponent post={post} />;
}
