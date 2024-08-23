import Image from "next/image";
import Footer from "./components/Footer";
import Title from "./components/Title";
import Menu from "./components/Menu";
import Offers from "./components/Offers";
import Review from "./components/Review";
import Contact from "./components/Contact";
import Head from "next/head";


export default function Home() {
  return (
    <>
     
      <Title />
      <div className="bg-back-50">
        <div className="border-b border-gray-200 pb-4">
          <Offers />
        </div>
        <div className="border-b border-gray-200 py-4">
          <Menu />
        </div>
        <div className="border-b border-gray-200 py-4">
          <Contact />
        </div>
        <div className="py-4">
          <Review />
        </div>
      </div>
    </>
  );
}
