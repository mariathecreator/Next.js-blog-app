import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/models/post";

export default async function handler(

    req: NextApiRequest,
    res: NextApiResponse
) {
    await connectDB();

    const { id } = req.query;

    if (typeof id !== "string") {
        return res.status(400).json({ message: "invalid id" })
    }

    if (req.method === "DELETE") {
        try {
            const deleted = await Post.findByIdAndDelete(id);
            if (!deleted) {
                return res.status(404).json({ message: "Post not found" });
            }
            return res.status(200).json({ message: "Post deleted" })

        }
        catch (error) {
            console.error("Error deleting post:", error);
            return res.status(500).json({ message: "Error deleting post" })
        }
    }

    if (req.method === "PUT") {
        try {
            const { title, slug, content } = req.body;
            if (!title || !slug || !content) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const updated = await Post.findByIdAndUpdate(
                id,
                { title, slug, content },
                { new: true }
            ).lean();
            if (!updated) {
                return res.status(404).json({ message: "Post not found" });
            }
            return res.status(200).json(updated);
        }
        catch (error) {
            console.error("Error updating post:", error);
            return res.status(500).json({ message: "Error updating post" });
        }
    }
    return res.status(405).json({ message: "Method not allowed" })
}
