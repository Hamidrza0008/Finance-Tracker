import "./globals.css";

import Navbar from "@/Components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
    >
      <body className=" flex flex-col  min-h-screen w-full">
        
        {children}
      </body>
    </html>
  );
}
