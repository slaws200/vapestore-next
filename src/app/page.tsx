import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="flex gap-4">
        <a
          href="/admin"
          className="px-6 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
        >
          Admin
        </a>
        <a
          href="/checkout"
          className="px-6 py-2 rounded bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
        >
          Checkout
        </a>
      </div>
    </div>
  );
}
