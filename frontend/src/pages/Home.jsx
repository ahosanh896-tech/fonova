import React from "react";
import Hero from "../components/Hero";
import Categories from "../components/Category";
import OurProduct from "../components/OurProduct";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import Container from "../components/Container";

const Home = () => {
  return (
    <div>
      <Container>
        <Hero />
        <Categories />
        <OurProduct />
        <BestSeller />
        <OurPolicy />
      </Container>
    </div>
  );
};

export default Home;
