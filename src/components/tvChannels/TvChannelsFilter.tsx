"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  options: string[];
  selectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
};

export default function TvChannelsFilter({
  options,
  selectedKeys: controlledKeys,
  onSelectionChange,
}: Props) {
  const [internalKeys, setInternalKeys] = useState<Set<string>>(new Set());
  const [showOptions, setShowOptions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedKeys = controlledKeys ?? internalKeys;
  const setSelectedKeys = onSelectionChange ?? setInternalKeys;

  function handleOptionClick(option: string) {
    const next = new Set(selectedKeys);
    if (next.has(option)) {
      next.delete(option);
    } else {
      next.add(option);
    }
    setSelectedKeys(next);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowOptions(false);
      }
    }
    if (showOptions) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showOptions]);

  return (
    <div ref={containerRef} className="relative flex flex-col items-center">
      <div className="flex w-3/4 justify-center align-middle">
        {options.map((category) => {
          const isSelected = selectedKeys.has(category);
          const uniqueRandom = Math.random().toString();
          return (
            <button
              key={uniqueRandom}
              className={`border-1 px-1 py-0.5 mx-3 rounded-md cursor-pointer transition-all hover:text-gray-250 hover:border-black ${isSelected ? "bg-black text-white" : ""}`}
              onClick={() => handleOptionClick(category)}
            >
              {category} {isSelected && " ✓"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
