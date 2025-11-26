import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import {
  getAllSlugs,
  getPostBySlug,
  type Post,
} from "../../data/posts";

type PostPageProps = {
  post: Post;
};

export default function PostPage({ post }: PostPageProps) {
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
            {new Date(post.date).toDateString()}
          </p>
          <div className="whitespace-pre-wrap leading-relaxed text-slate-100">
            {post.content}
          </div>
        </article>
      </div>
    </main>
  );
}


export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllSlugs();

  return {
    paths: slugs.map((slug) => ({
      params: { slug },
    })),
    fallback: false, // any slug not in paths -> 404
  };
};


export const getStaticProps: GetStaticProps<PostPageProps> = async ({
  params,
}) => {
  const slug = params?.slug as string;
  const post = getPostBySlug(slug);

  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      post,
    },
  };
};
