import React, { useRef, useState, useEffect, useCallback } from "react";
import { categories } from "../assets/assets";
import Title from "./Title";

const Categories = ({ setSelectedCategory }) => {
  const scrollRef = useRef(null);

  const total = categories.length;
  const extended = [...categories, ...categories, ...categories];

  const [activeIndex, setActiveIndex] = useState(total);

  //smooth horizontal scroll only
  const scrollToIndex = useCallback((index, behavior = "smooth") => {
    const container = scrollRef.current;
    const child = container?.children[index];
    if (!child) return;

    const left =
      child.offsetLeft - container.offsetWidth / 2 + child.offsetWidth / 2;

    container.scrollTo({ left, behavior });
  }, []);

  //start from middle copy
  useEffect(() => {
    const id = setTimeout(() => {
      scrollToIndex(total, "auto");
    }, 100);

    return () => clearTimeout(id);
  }, [scrollToIndex, total]);

  //STABLE infinite loop
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const maxScroll = container.scrollWidth;
      const visibleWidth = container.offsetWidth;
      const scrollLeft = container.scrollLeft;

      const sectionWidth = maxScroll / 3;

      //SAFE reset (far from center -> invisible)
      if (scrollLeft <= sectionWidth * 0.2) {
        container.scrollTo({
          left: scrollLeft + sectionWidth,
          behavior: "auto",
        });
        return;
      }

      if (scrollLeft >= sectionWidth * 1.8) {
        container.scrollTo({
          left: scrollLeft - sectionWidth,
          behavior: "auto",
        });
        return;
      }

      // Detect active item (center)
      const children = Array.from(container.children);
      const center = scrollLeft + visibleWidth / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      children.forEach((child, index) => {
        const childCenter = child.offsetLeft + child.offsetWidth / 2;

        const distance = Math.abs(center - childCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll (natural timing)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let interval;

    const start = () => {
      interval = setInterval(
        () => {
          scrollToIndex(activeIndex + 1);
        },
        2800 + Math.random() * 800,
      );
    };

    start();

    const stop = () => clearInterval(interval);

    container.addEventListener("touchstart", stop);
    container.addEventListener("mousedown", stop);

    return () => {
      clearInterval(interval);
      container.removeEventListener("touchstart", stop);
      container.removeEventListener("mousedown", stop);
    };
  }, [activeIndex, scrollToIndex]);

  return (
    <div className="px-4 sm:px-8 lg:px-16 py-10">
      {/* Title */}
      <div className="text-center mb-8 text-3xl">
        <Title text1={"Browse"} text2={"The Range"} />
        <p className="text-gray-500 text-sm sm:text-base mt-2">
          Discover furniture by category
        </p>
      </div>

      {/* MOBILE CAROUSEL */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory sm:hidden px-6 no-scrollbar"
      >
        {extended.map((item, index) => {
          const realIndex = index % total;

          return (
            <div
              key={index}
              onClick={() => setSelectedCategory(categories[realIndex].name)}
              className={`snap-center shrink-0 w-[75%] cursor-pointer 
              transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] 
              will-change-transform ${
                index === activeIndex
                  ? "scale-100 opacity-100 z-10"
                  : "scale-[0.85] opacity-30"
              }`}
            >
              {/* Image */}
              <div className="rounded-2xl overflow-hidden aspect-3/4 bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover 
                  transition-transform duration-1000 
                  ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
              </div>

              {/* Label */}
              <p className="text-center mt-3 text-lg font-medium">
                {item.name}
              </p>
            </div>
          );
        })}
      </div>

      {/* DESKTOP */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedCategory(item.name)}
            className="group cursor-pointer"
          >
            <div className="overflow-hidden rounded-xl">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-72 md:h-80 object-cover 
                transition-transform duration-500 ease-out 
                group-hover:scale-110"
              />
            </div>

            <p className="text-center mt-3 text-lg font-medium">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
