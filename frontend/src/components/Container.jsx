import React from "react";

const Container = ({ children }) => {
  return (
    <div className="px-4 sm:px-[4vw] md:px-[5vw] lg:px-[6vw]">{children}</div>
  );
};

export default Container;
