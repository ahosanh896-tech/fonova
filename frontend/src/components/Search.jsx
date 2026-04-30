import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Focus on search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchOpen(false);

    const trimmed = searchText.trim();
    if (trimmed) {
      navigate(`/collection?keyword=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/collection");
    }
    setSearchText("");
  };

  const handleClose = () => {
    setSearchOpen(false);
    setSearchText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  return (
    <>
      {searchOpen ? (
        // Expanded Search Bar
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-md lg:max-w-2xl"
        >
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200 focus-within:border-slate-700 focus-within:shadow-md transition">
            {/* Search Icon */}
            <svg
              className="w-5 h-5 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            {/* Input */}
            <input
              ref={searchInputRef}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search furniture, chairs, tables..."
              className="flex-1 outline-none text-sm bg-transparent text-gray-900 placeholder-gray-400"
            />

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition"
              aria-label="Close search"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
              </svg>
            </button>
          </div>
        </form>
      ) : (
        // Small Search Icon
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-label="Open search"
          className="flex items-center p-2 hover:bg-gray-100 rounded-full transition"
        >
          <svg
            className="w-5 h-5 text-gray-700 cursor-pointer"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      )}
    </>
  );
};

export default Search;
