"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Product } from "../types/product";
import { getAllProducts } from "../lib/products";
import Image from "next/image";
import Link from "next/link";

interface SearchInputProps {
  onSearch?: (results: Product[]) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  onSearch,
  placeholder = "Search products...",
  className = "",
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  // Fuzzy search function
  const fuzzySearch = (text: string, searchTerm: string): boolean => {
    const normalizedText = text.toLowerCase();
    const normalizedSearch = searchTerm.toLowerCase();

    if (normalizedSearch === "") return true;

    // Exact match gets highest priority
    if (normalizedText.includes(normalizedSearch)) return true;

    // Fuzzy matching - check if characters appear in order
    let searchIndex = 0;
    for (
      let i = 0;
      i < normalizedText.length && searchIndex < normalizedSearch.length;
      i++
    ) {
      if (normalizedText[i] === normalizedSearch[searchIndex]) {
        searchIndex++;
      }
    }

    return searchIndex === normalizedSearch.length;
  };

  // Search function with debouncing
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setIsOpen(false);
        onSearch?.([]);
        return;
      }

      setIsLoading(true);

      try {
        const allProducts = getAllProducts();
        const filteredResults = allProducts.filter(
          (product) =>
            fuzzySearch(product.name, searchQuery) && product.available
        );

        // Sort results by relevance (exact matches first, then fuzzy matches)
        const sortedResults = filteredResults.sort((a, b) => {
          const aExact = a.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          const bExact = b.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;

          // If both are exact or both are fuzzy, sort alphabetically
          return a.name.localeCompare(b.name);
        });

        setResults(sortedResults.slice(0, 10)); // Limit to 10 results
        setIsOpen(true);
        onSearch?.(sortedResults);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    },
    [onSearch]
  );

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, performSearch]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          window.location.href = `/${results[selectedIndex].id}`;
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Highlight search terms in text
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    if (!value.trim()) {
      setIsOpen(false);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (query !== "") {
      setIsOpen(true);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="fixed top-0 left-0 right-0 z-50 shadow-lg">
        <input
          name="search"
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg outline-none transition-all duration-200"
          autoComplete="off"
        />

        {/* Search icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          ) : (
            <svg
              className="w-5 h-5"
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
          )}
        </div>

        {/* Clear button */}
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search results dropdown */}
      {isOpen && (
        <div
          ref={resultsRef}
          className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto mt-6"
        >
          {results.length > 0 ? (
            <div>
              {results.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/${product.id}`}
                  className={`block px-4 py-2 hover:bg-gray-50 transition-colors ${
                    index === selectedIndex
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={`/${product.image}`}
                        alt={product.name}
                        fill
                        className="object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {highlightText(product.name, query)}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        ₽{product.price}
                      </p>
                      <span
                        className={`text-xs font-medium ${
                          product.stock! > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {product.stock! > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                />
              </svg>
              <p className="text-sm">Товар не найден</p>
              <p className="text-xs text-gray-400 mt-1">
                Попробуйте ввести другой запрос
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
