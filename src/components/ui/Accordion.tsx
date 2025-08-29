"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // иконки

type Section = {
  title: string;
  content: string;
  listItems?: string[];
};

const sections: Section[] = [
  {
    title: "Доставка",
    content: `Осуществляем платную доставку по тарифам:`,
    listItems: [
      "Тирасполь - 15р",
      "Парканы, Терновка, Суклея - 25р",
      "Кицканы - 35р",
      "Бендеры - 50р",
      "Слободзея - 65р",
    ],
  },
  {
    title: "Самовывоз",
    content:
      'Любой товар можно забрать самостоятельно по адресу г.Тирасполь, район Бородинка, у магазина "Фортуна"',
  },
];

export default function Accordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="divide-y divide-gray-200 w-full">
      {sections.map((section, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index}>
            <button
              onClick={() => toggleSection(index)}
              className="w-full flex justify-between items-center py-4 text-left font-medium text-gray-900"
            >
              {section.title}
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {isOpen && (
              <div className="pb-4 text-gray-600 text-sm">
                <p>{section.content}</p>
                {section.listItems && (
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    {section.listItems.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
