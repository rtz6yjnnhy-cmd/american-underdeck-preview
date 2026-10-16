import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Engineered } from "@/components/sections/Engineered";
import { Estimate } from "@/components/sections/Estimate";
import { Experience } from "@/components/sections/Experience";
import { Films } from "@/components/sections/Films";
import { Finishes } from "@/components/sections/Finishes";
import { Footer } from "@/components/sections/Footer";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Nav } from "@/components/sections/Nav";
import { Possibilities } from "@/components/sections/Possibilities";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Intro />
        <Engineered />
        <Gallery />
        <BeforeAfter />
        <Possibilities />
        <Finishes />
        <Experience />
        <Films />
        <Estimate />
      </main>
      <Footer />
    </>
  );
}
