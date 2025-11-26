// pages/index.tsx
import type { GetStaticProps } from "next";
import Link from "next/link";
import { getAllPosts, type Post } from "../data/posts";

type HomeProps = {
  posts: Post[];
};

export default function Home({ posts }: HomeProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">My Blog</h1>
          <p className="text-slate-300">
            A simple Next.js + TypeScript + Tailwind blog.
          </p>
        </header>

        <section className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border border-slate-800 rounded-xl p-5 hover:border-blue-500 transition"
            >
              <h2 className="text-2xl font-semibold mb-1">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:underline text-blue-400"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-xs text-slate-400 mb-2">
                {new Date(post.date).toDateString()}
              </p>
              <p className="text-slate-200 mb-3">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="text-sm text-blue-400 hover:underline"
              >
                Read more →
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}


export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const posts = getAllPosts();

  return {
    props: {
      posts,
    },
  };
};
