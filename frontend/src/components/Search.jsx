import { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "../Icon";

const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closeSearch();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, closeSearch]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    closeSearch();

    navigate(
      trimmedQuery
        ? `/collection?keyword=${encodeURIComponent(trimmedQuery)}`
        : "/collection",
    );
  };

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeSearch();
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        aria-label="Open search"
      >
        <SearchIcon className="w-5 h-5" />
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 " />

          {/* Modal Content */}
          <div
            ref={modalRef}
            className="relative w-full max-w-xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-xl">
                <SearchIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search furniture, chairs, tables..."
                  className="flex-1 bg-transparent text-base text-gray-900 placeholder:text-gray-400 outline-none"
                />

                <button
                  type="button"
                  onClick={closeSearch}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-3 py-1 rounded-md hover:bg-gray-100"
                  aria-label="Close search"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Search;
