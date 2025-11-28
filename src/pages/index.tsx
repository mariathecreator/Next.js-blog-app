// pages/index.tsx
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Post, type Posts } from "@/models/post";

type HomePost = {
  _id: string;
  title: string;
  slug: string;
  createdAt: string;
};

type HomeProps = {
  posts: HomePost[];
}

export default function Home({ posts = [] }: HomeProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold mb-1">My Blog</h1>
            <p className="text-slate-300 text-sm">
              Powered by Next.js, MongoDB &amp; Mongoose
            </p>
          </div>

          <Link
            href="/new-post"
            className="px-3 py-2 rounded-md bg-blue-600 text-sm font-medium hover:bg-blue-500"
          >
            + New Post
          </Link>
        </header>

        {posts.length === 0 ? (
          <p className="text-slate-400 text-center ">
            No posts yet. Click &quot;New Post&quot; to create your first blog!
          </p>
        ) : (
          <section className="space-y-5">
            {posts.map((post) => (
              <article
                key={post._id}
                className="border border-slate-800 rounded-xl p-5 hover:border-blue-500 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-2xl font-semibold mb-1">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:underline text-blue-400"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-xs text-slate-400 mb-3">
                      {new Date(post.createdAt).toDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/edit/${post._id}`}
                      className="text-xs text-yellow-300 hover:text-yellow-200 border border-yellow-500/40 rounded px-2 py-1"
                    >
                      Edit
                    </Link>

                    <button
                      className="text-xs text-red-400 hover:text-red-300 border border-red-500/40 rounded px-2 py-1"
                      onClick={async () => {
                        const ok = confirm("Are you sure you want to delete this post?");
                        if (!ok) return;

                        try {
                          const res = await fetch(`/api/posts/${post._id}`, {
                            method: "DELETE",
                          });

                          if (!res.ok) {
                            const data = await res.json().catch(() => ({}));
                            alert(data.message || "Failed to delete post");
                            return;
                          }

                          window.location.reload();
                        } catch (err) {
                          console.error(err);
                          alert("Something went wrong deleting the post");
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>

                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm text-blue-400 hover:underline"
                >
                  Read more →
                </Link>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}


export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {

  try {

    await connectDB();
    const docs: Posts[] = await Post.find({}).sort({ createdAt: -1 }).lean();

    const posts: HomePost[] = docs.map((doc) => ({
      _id: doc._id.toString(),
      title: doc.title,
      slug: doc.slug,
      createdAt: doc.createdAt.toISOString(),
    }))


    return {
      props: {
        posts,
      },
    };
  }
  catch (error) {
    console.error("Error in getServerSideProps for /: ", error)
    return {
      props: {
        posts: [],
      }
    }
  }
};
