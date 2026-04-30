import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "../Icon";

const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Close search
  const closeSearch = () => {
    setIsOpen(false);
    setQuery("");
  };

  // Focus input
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // ESC close (no stale issue)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();

    closeSearch();

    navigate(
      trimmed
        ? `/collection?keyword=${encodeURIComponent(trimmed)}`
        : "/collection",
    );
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-full transition"
        aria-label="Open search"
      >
        <SearchIcon />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={closeSearch}
        />
      )}

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-50 animate-fade-in">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full px-6 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all focus-within:border-slate-800 focus-within:shadow-[0_15px_40px_rgba(0,0,0,0.18)]">
              {/* Icon */}
              <SearchIcon className="w-5 h-5 text-gray-400" />

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search furniture, chairs, tables..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
              />

              {/* Close Button ONLY */}
              <button
                type="button"
                onClick={closeSearch}
                className="text-gray-500 hover:text-black transition"
                aria-label="Close search"
              >
                ✕
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Search;
