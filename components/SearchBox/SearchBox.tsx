"use client";

import { useEffect, useState } from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onSearch: (value: string) => void;
}

export default function SearchBox({ value, onSearch }: SearchBoxProps) {
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query !== value) {
        onSearch(query);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <input
      className={css.input}
      type="text"
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      placeholder="Search notes..."
    />
  );
}
