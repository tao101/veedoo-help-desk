import type { Metadata } from "next";
import "./globals.css";

import { Providers } from "./providers";
import { poppinsFont } from "@/src/utils/fonts";
import { Toaster } from "react-hot-toast";

//TODO: add default SEO metadata
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` bg-white ${poppinsFont.variable} `}>
        <Toaster position="bottom-center" />
        <Providers>
          <div className="w-screen min-h-screen flex flex-col bg-white">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
