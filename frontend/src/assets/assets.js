import fornova from "./fornova.svg";
import fornova_word from "./fornova_word.svg";

import stripe_logo from "./stripe_logo.png";

import hero1 from "./hero1.png";
import hero2 from "./hero2.png";
import hero3 from "./hero3.png";
import hero4 from "./hero4.png";
import hero5 from "./hero5.png";

import about from "./about.png";
import contact from "./contact.png";

import shop_hero from "./shop_hero.png";

import diningImg from "./dining.png";
import livingImg from "./living.jpg";
import bedroomImg from "./bedroom.jpg";

export const assets = {
  fornova,
  fornova_word,
  hero1,
  hero2,
  hero3,
  hero4,
  hero5,
  stripe_logo,

  about,
  contact,

  shop_hero,
};

export const products = [
  {
    name: "Nordic Dining Set",
    image: assets.hero1,
    description: "Create warm and stylish moments around every meal daily.",
  },
  {
    name: "Aura Sculpt Chair",
    image: assets.hero2,
    description: "Turn any space into a bold and artistic statement piece.",
  },
  {
    name: "Crimson Lounge Duo",
    image: assets.hero3,
    description: "Relax in comfort with a perfect blend of modern style.",
  },
  {
    name: "Midnight Luxe Sofa",
    image: assets.hero4,
    description: "Add depth and elegance with premium textured comfort.",
  },
  {
    name: "Cloud Haven Sofa",
    image: assets.hero5,
    description: "Unwind daily in soft comfort with a calm modern touch.",
  },
];

export const categories = [
  { name: "Dining", image: diningImg },
  { name: "Living", image: livingImg },
  { name: "Bedroom", image: bedroomImg },
];
