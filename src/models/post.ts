import { Schema,model,models,Document } from "mongoose";

export interface Posts extends Document{
    title:string;
    slug:string;
    content:string;
    createdAt:Date;
}

const PostSchema = new Schema<Posts>(
    {
        title:{type:String,required:true},
        slug:{type:String,required:true,unique:true},
        content:{type:String,required:true},
    },
    {
        timestamps:true
    }
);

export const Post = models.Post || model<Posts>("Post",PostSchema)