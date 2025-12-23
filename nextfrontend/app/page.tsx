import { Button, Typography } from "@mui/material";
import { Lilita_One } from "next/font/google";
import WatchList from "./components/home/watchlist";
import LaptopList from "./components/home/laptoptlist";
import TabletList from "./components/home/tabletlist";

const lilita_One = Lilita_One({ weight: '400', subsets: ['latin'] });


export default function Home() {
  //https://www.pngwing.com/en/free-png-veqaj
  const items = ['Apple', 'Banana', 'Cherry'];

  return (
    <div className="row w-full">
      
      {/* banner image */}
      <div className="w-full h-[500px] ">
        <img
          src="/ecbannerimage.webp"
          alt="Full Width Image"
          className="w-full h-full "
        />
      </div>

      {/* watch list */}
      <WatchList/>


      {/* tablet list */}
      <TabletList/>

      {/* Laptop list */}
      <LaptopList/>

    </div>
  );
}
