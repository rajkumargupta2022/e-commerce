import { Outfit } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
// import 'sweetalert2/src/sweetalert2.css'
import { Toaster } from "react-hot-toast";
import { AppContextProvider } from "@/context/AppContext";


const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "LebelAkansha",
  description: "E-Commerce with LebelAkansha",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700`} >
          <Toaster />
          <AppContextProvider>
            {children}
          </AppContextProvider>
        </body>
      </html>
  );
}
