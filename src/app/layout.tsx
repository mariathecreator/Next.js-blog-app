// import "../styles/globals.css";

import { title } from "process";


export const metadata = {
    title: "My Blog",
    description: "Blog demo using Server Components"
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
return (
    <html lang="en">
        <body>
            {children}
        </body>
    </html>
)
}