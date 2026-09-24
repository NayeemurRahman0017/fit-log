"use client";

import {
  useMemo,
  useState,
} from "react";

import { useApp } from "../shared/AppProvider";

import { WorkoutCard } from "./WorkoutCard";

function ChevronDown({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function Library() {
  const {
    workouts,
    loading,
  } = useApp();

  const [sort, setSort] = useState<
    "duration" | "calories" | "rating"
  >("duration");

  const sorted = useMemo(() => {
    return [...workouts].sort((a, b) => {
      if (sort === "duration") {
        return a.duration - b.duration;
      }

      if (sort === "calories") {
        return (
          a.caloriesBurned -
          b.caloriesBurned
        );
      }

      return b.rating - a.rating;
    });
  }, [workouts, sort]);

  return (
    <section
      id="library"
      className="container-fit scroll-mt-24 py-20 sm:py-24"
    >
      <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">
            12 movements
          </p>

          <h2 className="display mt-2 text-5xl font-bold uppercase sm:text-6xl">
            The Library
          </h2>

          <p className="mt-2 text-sm text-white/45">
            Twelve lifts covering every major muscle group.
          </p>
        </div>

        <label className="relative flex w-full items-center gap-3 rounded-full border border-white/15 px-4 py-3 text-xs font-bold uppercase tracking-[.12em] sm:w-auto">
          Sort By

          <select
            value={sort}
            onChange={(event) =>
              setSort(
                event.target.value as
                  | "duration"
                  | "calories"
                  | "rating"
              )
            }
            className="appearance-none bg-transparent pr-5 text-acid outline-none"
          >
            <option
              className="bg-[#111]"
              value="duration"
            >
              Duration
            </option>

            <option
              className="bg-[#111]"
              value="calories"
            >
              Calories
            </option>

            <option
              className="bg-[#111]"
              value="rating"
            >
              Rating
            </option>
          </select>

          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3"
          />
        </label>
      </div>

      {loading ? (
        <div className="grid min-h-105 place-items-center">
          <div className="flex items-center gap-3 text-sm font-semibold text-white/50">
            <span className="size-2 animate-pulse rounded-full bg-acid" />

            Loading workouts…
          </div>
        </div>
      ) : sorted.length ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sorted.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-sm text-white/40">
          Couldn&apos;t load the workout library.
          Please refresh and try again.
        </div>
      )}
    </section>
  );
}