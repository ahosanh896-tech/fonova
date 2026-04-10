import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div>
      <hr className="text-gray-300 mt-5" />
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 mb-10 mt-20 px-6 text-sm">
        {/* Brand Section */}
        <div>
          <img
            src={assets.fornova_word}
            alt="logo"
            className="mb-5 -ml-2 -mt-4 w-32"
          />
          <p className="w-full md:w-2/3 text-gray-600 leading-relaxed">
            Transform your living space with stylish and comfortable furniture.
            We bring modern designs, durable materials, and affordable prices to
            make your home truly yours.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className="text-xl font-semibold mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              <Link to="/" className="hover:text-black transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-black transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-black transition">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-black transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className="text-xl font-semibold mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              <a
                href="tel:+8801778XXXXXX"
                className="hover:text-black transition"
              >
                +880 1778-XXX-505
              </a>
            </li>
            <li>
              <a
                href="mailto:support@yourfurniture.com"
                className="hover:text-black transition"
              >
                support@yourfornova.com
              </a>
            </li>
            <li>Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div>
        <hr className="text-gray-300" />
        <p className="py-5 text-sm text-center text-gray-500">
          © 2026 ForNova.com — All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
