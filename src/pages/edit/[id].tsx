import { useState,FormEvent } from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { connectDB } from "@/lib/mongodb";
import { Post, type Posts } from "@/models/post";

type EditPostProps ={
    post:{
        id:string;
        title:string;
        slug:string;
        content:string;
    }|null;
}

export default function EditPostPage({ post }: EditPostProps) {
  const router = useRouter();

  if (!post) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <Link
            href="/"
            className="text-sm text-blue-400 hover:underline mb-6 inline-block"
          >
            ← Back to home
          </Link>
          <p>Post not found.</p>
        </div>
      </main>
    );
  }
 const { id: postId, title: initialTitle, slug: initialSlug, content: initialContent } = post;

  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, content }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus(data.message || "Failed to update post");
        setLoading(false);
        return;
      }

      setStatus("Post updated successfully 🎉");
      // Redirect to blog page
      router.push(`/blog/${slug}`);
    } catch (error) {
      console.error(error);
      setStatus("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Edit Post</h1>
          <Link
            href="/"
            className="text-sm text-blue-400 hover:underline"
          >
            ← Back to home
          </Link>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Slug</label>
            <input
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Used in the URL: /blog/&lt;slug&gt;
            </p>
          </div>

          <div>
            <label className="block text-sm mb-1">Content</label>
            <textarea
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm h-40"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-md bg-blue-600 text-sm font-medium hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Post"}
          </button>
        </form>

        {status && <p className="mt-4 text-sm text-slate-200">{status}</p>}
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<EditPostProps> = async (
  ctx
) => {
  try {
    await connectDB();
    const { id } = ctx.params as { id: string };

    const doc: Posts | null = await Post.findById(id).lean();

    if (!doc) {
      return { props: { post: null } };
    }

    return {
      props: {
        post: {
          id: doc._id.toString(),
          title: doc.title,
          slug: doc.slug,
          content: doc.content,
        },
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps for edit:", error);
    return { props: { post: null } };
  }
};

