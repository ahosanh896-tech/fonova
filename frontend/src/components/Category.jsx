import React from "react";
import { categories } from "../assets/assets";
import Title from "./Title";

const Categories = ({ setSelectedCategory }) => {
  return (
    <div className="px-4 sm:px-8 lg:px-16 py-10">
      {/* Title */}
      <div className="text-center mb-8 text-3xl">
        <Title className="" text1={"Browse"} text2={"The Range"} />
        <p className="text-gray-500 text-sm sm:text-base mt-2">
          Discover furniture by category
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedCategory(item.name)}
            className="group cursor-pointer"
          >
            {/* Image */}
            <div className="overflow-hidden rounded-xl">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-64 sm:h-72 md:h-80 object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Label */}
            <p className="text-center mt-3 text-lg font-medium">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
