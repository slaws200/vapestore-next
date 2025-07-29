import Link from "next/link";
import React from "react";

interface NotFoundProps {}

export default function NotFound({}: NotFoundProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-gray-700 font-bold">Not Found</h1>
        <Link href="/" className="text-blue-600">
          &larr; Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
