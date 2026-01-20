import { Hero } from "@/components/sections/Hero";
import { Countdown } from "@/components/sections/Countdown";
import { OurStory } from "@/components/sections/OurStory";
import { QuickInfo } from "@/components/sections/QuickInfo";
import { Venues } from "@/components/sections/Venues";
import { TravelStay } from "@/components/sections/TravelStay";

export default function Home() {
  return (
    <>
      <Hero />
      <Countdown />
      <OurStory />
      <QuickInfo />
      <Venues />
      <TravelStay />
    </>
  );
}
