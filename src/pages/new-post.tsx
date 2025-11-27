import { FormEvent, useState } from "react";
import Link from "next/link";

export default function NewPost() {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setStatus(null);
        setLoading(true);

        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, slug, content })
            })

            if (!res.ok) {
                const data = await res.json();
                setStatus(data.message || "Failed to create post");
                setLoading(false);
                return;
            }

            setStatus("Post created successfully");
            setTitle("");
            setSlug("");
            setContent("");
        }
        catch (error) {
            console.error(error);
            setStatus("Something went wrong")
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <div className="max-w-2xl mx-auto px-4 py-10">
                <header className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Create New Post</h1>
                    <Link href="/" className="text-sm text-blue-400 hover:underline">← Back to home</Link>
                </header>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Title</label>
                        <input className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="My awesome blog post"
                            required />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Slug</label>
                        <input  className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500"
                        value={slug}
                        onChange={(e)=>setSlug(e.target.value)}
                        placeholder="my-awesome-blog-post"
                        required/>
                        <p className="text-xs text-slate-500 mt-1">
                            This will be used in the URL:/blog/&lt;slug&gt;
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm mb-1">content</label>
                        <textarea className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm h-40 focus:outline-none focus:ring focus:ring-blue-500"
                        value={content}
                        onChange={(e)=>setContent(e.target.value)}
                        placeholder="Write your blog content here..."
                        required/>
                    </div>

                    <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-md bg-blue-600 text-sm font-medium hover:bg-blue-500 disabled:opacity-60"
                    >
                        {loading?"Creating...":"Create Post"}
                    </button>
                </form>

                {status&&(
                    <p className="mt-4 text-sm text-slate-200">
                        {status}
                    </p>
                )}
            </div>
        </main>
    )
}
