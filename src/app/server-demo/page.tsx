import { connectDB } from "@/lib/mongodb";
import { Post, type Posts } from "@/models/post";

export default async function serverDemoPage(){

    await connectDB()

    const docs:Posts[]=await Post.find({})
    .sort({createdAt:-1})
    .lean();

    const posts = docs.map((doc)=>({
        id:doc._id.toString(),
        title:doc.title,
        slug:doc.slug,
        createdAt:doc.createdAt.toISOString()
    }))

    return(
        <main>
            <div>
                <header>
                    <h1>Server Component Demo</h1>
                    <p>This page is rendered using a 
                        <span>Server Component</span>in App Router.
                    </p>
                    <p>Data is loaded directly from MongoDB without an API route.</p>
                </header>

                {posts.length===0?(
                    <p>No posts found. Try creating a post from your Page Router UI and refresh this page.</p>
                ):(
                    <ul>
                        {posts.map((post)=>(
                            <li key = {post.id}>
                                <h2>{post.title}</h2>
                                <p>{new Date(post.createdAt).toLocaleString()}</p>
                                <p>slug:
                                    <span>{post.slug}</span>
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    )
}