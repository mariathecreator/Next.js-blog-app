import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { Post, type Posts } from "@/models/post";


export default async function Handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await connectDB()

    if (req.method === "GET") {
        try {
            const posts: Posts[] = await Post.find().sort({ createdAt: -1 });
            return res.status(200).json(posts);
        }
        catch (error) {
            console.error("error fetching posts", error);
            return res.status(500).json({ message: "Error fetching posts" })
        }
    }

    if (req.method === "POST"){
        try{
            const {title,slug,content} = req.body;

            if(!title||!slug||!content){
                return res.status(400).json({message:"All fields are required"})
            }

            const existing = await Post.findOne({slug});
            if (existing){
                return res.status(409).json({message:"Slug already exists"})
            }

            const post = await Post.create({title,slug,content});
            return res.status(201).json(post);
        }
        catch(error){
            console.log("Error creating post",error)
            return res.status(500).json({message:"Error creating post"})
        }
    }

    return res.status(405).json({message:"Method not allowed"})
}

