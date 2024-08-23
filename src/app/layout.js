import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
import Footer from "./components/Footer"
import Navbar from "./components/NavBar";
import { UserProvider } from '@auth0/nextjs-auth0/client';

export const metadata = {
  title: "The Indian Cuisine",
  description: "The Indian Cuisine restaurant. You will feel welcomed into our casual, intimate space on Steeles Avenue West by our friendly staff from the second you enter the door until the moment you say goodbye. With choices like our authentic tandoori, lamb or goat curry, and biryani that is cooked in exotic spices, you will wonder why you didn’t visit sooner! We also have a wide number of vegetarian dishes, basmati rice options, and freshly made Indian bread, that pair perfectly with any meal!"}

export default function RootLayout({ children }) {
  return (
    <>

      <html lang="en">
        <UserProvider>
          <body className={inter.className}>
            <Navbar />

            {children}
            <Footer/>
          </body>
        </UserProvider>
      </html >
    </>
  );
}
