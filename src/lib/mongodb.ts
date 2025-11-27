import mongoose from "mongoose";

const MONGODB_URI=process.env.MONGODB_URI as string;

export async function connectDB(){
    if(!MONGODB_URI){
        throw new Error("Add MONGODB_URI in .env.local")
    }
}

await mongoose.connect(MONGODB_URI)