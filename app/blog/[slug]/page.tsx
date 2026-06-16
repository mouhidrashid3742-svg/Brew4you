import { blogPosts } from "@/data/blogs";
import { notFound } from "next/navigation";

export default function BlogPostPage({ params }: any) {
  const post = blogPosts.find((item) => item.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-24 sm:px-8 lg:px-10">
      <section className="space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">{post.category}</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">{post.title}</h1>
        <p className="text-ink/70">Published {post.published}</p>
        <article className="mt-10 space-y-6 leading-8 text-ink/80">
          <p>{post.excerpt}</p>
          <p>
            This premium article explores the details you need to understand how to make elegant coffee at home and choose the right drink for every occasion.
          </p>
          <p>Enjoy insights, brewing techniques, and thoughtful recommendations tailored for Brew4You customers.</p>
        </article>
      </section>
    </main>
  );
}
