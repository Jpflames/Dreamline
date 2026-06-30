import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dreamline | Creative Learning Academy & Resources",
  description: "Master graphic design, motion graphics, branding, photography and video editing through practical tutorials, creative challenges and professional asset templates.",
  keywords: ["graphic design", "video editing", "motion graphics", "figma tutorials", "photoshop downloads", "creative assets"],
  openGraph: {
    title: "Dreamline | Creative Learning Academy & Resources",
    description: "Learn. Create. Inspire. Master creative skills with industry professionals.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-foreground relative">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover -z-10"
        >
          <source src="/dreamline-bg.mp4" type="video/mp4" />
        </video>
        <div className="relative z-0 flex flex-col min-h-full w-full bg-background/80">
          <AppProvider>
            <Navbar />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
            <Footer />
          </AppProvider>
        </div>
      </body>
    </html>
  );
}
