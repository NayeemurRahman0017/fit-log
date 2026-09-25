import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#0a0b0d] px-5 text-white">
      <div className="text-center">

        <p className="text-sm font-black uppercase tracking-[0.3em] text-[#ccff00]">
          404
        </p>

        <h1 className="mt-3 font-display text-4xl font-black uppercase">
          Page Not Found
        </h1>

        <p className="mt-3 text-sm text-[#777b82]">
          The page you are looking for does not exist.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#ccff00] px-5 py-3 text-xs font-black uppercase text-black transition hover:bg-[#d9ff55]"
        >
          <ArrowLeft size={14} />
          Go to workouts
        </Link>

      </div>
    </main>
  );
}