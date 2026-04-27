import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import Container from "../components/Container";

const About = () => {
  return (
    <Container>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"FORNOVA"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about}
          alt="Fornova Furniture"
        />

        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Fornova was created with a vision to redefine modern living through
            thoughtfully designed furniture. We believe that every space tells a
            story, and our mission is to help you create spaces that reflect
            comfort, style, and personality.
          </p>

          <p>
            From elegant sofas and statement chairs to functional storage and
            contemporary home essentials, Fornova offers a curated collection of
            premium furniture crafted with quality materials and timeless
            aesthetics.
          </p>

          <b className="text-gray-800">Our Mission</b>

          <p>
            At Fornova, our mission is to bring together design, comfort, and
            functionality. We aim to deliver furniture that not only enhances
            your home but also elevates your everyday living experience — with
            convenience, trust, and exceptional quality.
          </p>
        </div>
      </div>

      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Premium Quality:</b>
          <p className="text-gray-600">
            Every piece at Fornova is carefully crafted using high-quality
            materials to ensure durability, comfort, and long-lasting beauty.
          </p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Modern Design:</b>
          <p className="text-gray-600">
            Our collections blend modern trends with timeless design, helping
            you create spaces that feel both stylish and functional.
          </p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Customer First:</b>
          <p className="text-gray-600">
            We prioritize your experience from browsing to delivery, ensuring
            smooth service, reliable support, and complete satisfaction.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default About;
