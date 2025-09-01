"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  options: Option[];
  placeholder?: string;
  onChange?: (value: string) => void;
};

export default function Select({
  options,
  placeholder = "Выберите...",
  onChange,
}: SelectProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);

  const handleSelect = (option: Option) => {
    setSelected(option);
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full h-full p-1">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
      >
        <span className="text-gray-500">
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <button
        type="button"
        disabled={!selected}
        onClick={() =>
          selected && router.push(`/createProduct/${selected.value}`)
        }
        className="px-4 py-2 text-sm w-full font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {"Добавить товар"}
      </button>

      {isOpen && (
        <ul className="absolute left-0 z-10 mt-1 w-full bg-white rounded-lg shadow-lg overflow-y-auto divide-y divide-gray-100">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
