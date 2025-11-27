import type { GetServerSideProps } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Post, type Posts } from "@/models/post";

type PostPageProps = {
  post: {
    _id: string;
    title: string;
    slug: string;
    content: string;
    createdAt: string;
  } | null;
};

export default function PostPage({ post }: PostPageProps) {
  if (!post) {
   return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <Link
            href="/"
            className="text-sm text-blue-400 hover:underline mb-6 inline-block"
          >
            ← Back to home
          </Link>
          <p className="text-slate-300">Post not found.</p>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href="/"
          className="text-sm text-blue-400 hover:underline mb-6 inline-block"
        >
          ← Back to home
        </Link>

        <article>
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <p className="text-xs text-slate-400 mb-5">
            {new Date(post.createdAt).toDateString()}
          </p>
          <div className="whitespace-pre-wrap leading-relaxed text-slate-100">
            {post.content}
          </div>
        </article>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<PostPageProps> = async (ctx) => {

  try {
    await connectDB();

    const slug = ctx.params?.slug as string;

    const doc: Posts | null = await Post.findOne({ slug }).lean();
    if (!doc) {
      return {
        props: {
          post: null,
        }
      }
    }

    return {
      props: {
        post: {
          _id: doc._id.toString(),
          title: doc.title,
          slug: doc.slug,
          content: doc.content,
          createdAt: doc.createdAt.toISOString(),
        }
      }
    }
  }
  catch (error) {
    console.error("Error loading post by slug", error);
    return {
      props: {
        post: null,
      },
    };
  };
}


