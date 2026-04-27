import { forwardRef } from "react";

export const FloatingInput = forwardRef(
  ({ icon: Icon, value = "", placeholder, type = "text", ...props }, ref) => {
    const hasValue = value?.trim()?.length > 0;

    return (
      <div
        onClick={() => ref?.current?.focus()}
        className={`flex gap-2 items-center border px-4 py-2 cursor-text transition-all 
          ${hasValue ? "border-black" : "border-gray-300"}
        `}
      >
        {/* Icon */}
        {Icon && (
          <Icon
            className={`w-4 h-4 transition-all duration-200 text-gray-800 text-hs
              ${hasValue ? "opacity-0 scale-75 w-0" : "opacity-100 mr-2"}
            `}
          />
        )}

        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className="w-full outline-none bg-transparent text-md"
          {...props}
        />
      </div>
    );
  },
);
