import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import Container from "../components/Container";

const Contact = () => {
  return (
    <Container>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"CONTACT"} text2={"FORNOVA"} />
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img
          className="w-full md:max-w-[480px]"
          src={assets.contact}
          alt="Fornova showroom"
        />

        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-700">
            Visit Our Showroom
          </p>

          <p className="text-gray-500">
            221B Modern Living Street <br />
            New York, USA
          </p>

          <p className="text-gray-500">
            Tel: +1 234 567 890 <br />
            Email: support@fornova.com
          </p>

          <p className="font-semibold text-xl text-gray-700">Join Fornova</p>

          <p className="text-gray-500">
            Be part of a team that designs the future of modern living. Explore
            exciting opportunities with us.
          </p>

          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            Explore Careers
          </button>
        </div>
      </div>
    </Container>
  );
};

export default Contact;
