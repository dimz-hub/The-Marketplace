import Image from "next/image";
import Hero from "./components/hero";
import CategorySection from "./components/Category";

export default function Home() {
  return (
    <div className="">
       <Hero />
       <CategorySection />
    </div>
  );
}
