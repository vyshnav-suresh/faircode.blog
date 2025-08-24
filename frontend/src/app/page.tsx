import { useQuery } from '@tanstack/react-query';
import api from '../utils/axios';
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800 font-sans">
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-24 text-center">
        <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 dark:text-white mb-8 drop-shadow-lg animate-pulse">
          Coming Soon
        </h1>
        <p className="text-lg sm:text-2xl text-gray-700 dark:text-gray-200 mb-8 max-w-2xl">
          Our new blog platform is launching soon. Stay tuned!
        </p>
      </main>
    </div>
  );
}
