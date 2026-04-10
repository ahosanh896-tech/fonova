import React from "react";
import Hero from "../components/Hero";
import Categories from "../components/Category";
import OurProduct from "../components/OurProduct";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";

const Home = () => {
  return (
    <div>
      <Hero />
      <Categories />
      <OurProduct />
      <BestSeller />
      <OurPolicy />
    </div>
  );
};

export default Home;
