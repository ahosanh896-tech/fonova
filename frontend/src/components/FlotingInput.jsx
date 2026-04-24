import { useRef } from "react";
import { Mail, Lock, User } from "../Icon";

export function FloatingInput({
  Icon,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  const inputRef = useRef(null);

  const hasValue = value?.trim()?.length > 0;

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={`flex items-center border rounded-md px-3 py-2 cursor-text transition-all
        ${hasValue ? "border-black" : "border-gray-300"}
      `}
    >
      {/* Icon */}
      {Icon && (
        <Icon
          className={`w-5 h-5 transition-all duration-200
      ${hasValue ? "opacity-0 w-0" : "opacity-100 mr-2"}
    `}
        />
      )}

      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full outline-none bg-transparent text-sm"
      />
    </div>
  );
}
