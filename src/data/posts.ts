export type Post={
    slug:string;
    title:string;
    date:string;
    excerpt:string;
    content:string;
};

export const post:Post[]=[
{
    slug:"getting-started-with-nextjs",
    title:"Getting started with Next.js",
    date:"2025-11-24",
    excerpt:"A quick intro to building apps with Next.js.",
    content:`Next.js is a React framework that gives you:
- File based routing
- Server-side rendering
- Static site generation
- API routes
and more.`
},
{
    slug:"learning-typescript",
    title:"Learning TypeScript as a JS Developer",
    date:"2025-11-20",
    excerpt:"Why TypeScript is worth it and how to start.",
    content:`TypeScript adds types on top of JavaScript.
It helps you catch bugs early and makes your code easier to work with.`
}
]

export function getAllPosts(){
    return post.sort((a,b)=>(a.date<b.date?1:-1))
}

export function getPostBySlug(slug:string){
    return post.find((post)=>post.slug===slug)||null;
}

export function getAllSlugs(){
    return post.map((post)=>post.slug)
}