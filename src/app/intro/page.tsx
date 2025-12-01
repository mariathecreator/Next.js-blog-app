
export default async function Intro(){
    return (
        <>
        <h1>Hello user!</h1>
        <p>Welcome to my blog! This blog app is created to help the newbies understand the JS programming concepts simple.</p>
        <footer>@ {new Date().toString()}</footer>
        </>
        
    )
}