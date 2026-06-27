"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface BlogPost {
  _id?: string;
  id?: string;
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  published?: string;
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs?published=true");
        const data = await res.json();
        setBlogPosts(data.blogs || []);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
      <section className="space-y-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">Insights</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">Expert articles for better coffee moments.</h1>
        <p className="mx-auto max-w-3xl leading-8 text-ink/75">
          Read premium guides on brewing, beans, and the differences between your favorite drinks at 9 BAR.
        </p>
      </section>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {loading ? (
          <p className="col-span-full text-center text-ink/70">Loading articles...</p>
        ) : blogPosts.length === 0 ? (
          <p className="col-span-full text-center text-ink/70">No articles published yet.</p>
        ) : (
          blogPosts.map((post) => (
          <article key={post.slug} className="glass-card rounded-[32px] p-8">
            <div className="mb-4 flex items-center justify-between gap-3 text-sm text-ink/60">
              <span>{post.category}</span>
              <span>{post.published ? new Date(post.published).toLocaleDateString() : ""}</span>
            </div>
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <p className="mt-4 leading-7 text-ink/80">{post.excerpt}</p>
            <div className="mt-6">
              <Link href={`/blog/${post.slug}`}>
                <Button variant="outline">Read Article</Button>
              </Link>
            </div>
          </article>
        ))
        )}
      </div>
    </main>
  );
}
