"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import WorkoutCard from "./WorkoutCard";
import { useApp } from "../shared/AppProvider";

type SortOption = "duration" | "calories" | "rating";

export default function Library() {
  const { workouts, loading } = useApp();

  const [sortBy, setSortBy] = useState<SortOption>("duration");

  const sortedWorkouts = useMemo(() => {
    const data = [...workouts];

    if (sortBy === "duration") {
      return data.sort((a, b) => a.duration - b.duration);
    }

    if (sortBy === "calories") {
      return data.sort(
        (a, b) => b.caloriesBurned - a.caloriesBurned
      );
    }

    if (sortBy === "rating") {
      return data.sort((a, b) => b.rating - a.rating);
    }

    return data;
  }, [workouts, sortBy]);

  return (
    <section
      id="library"
      className="bg-[#090909] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="container mx-auto">
    
      <div className="mx-auto max-w-350">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#ccff00]">
              THE LIBRARY
            </p>

            <h2 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-5xl">
              WORKOUT LIBRARY
            </h2>

            <p className="mt-4 text-sm text-[#8a8a8a] sm:text-base">
              Twelve lifts covering every major muscle group.
            </p>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as SortOption)
              }
              className="appearance-none rounded-xl border border-[#333333] bg-[#151515] py-3 pl-4 pr-11 text-sm font-semibold text-white outline-none transition focus:border-[#ccff00]"
            >
              <option value="duration">Sort by Duration</option>
              <option value="calories">Sort by Calories</option>
              <option value="rating">Sort by Rating</option>
            </select>

            <ChevronDown
              size={17}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#ccff00]"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-90 animate-pulse rounded-2xl border border-[#222] bg-[#111]"
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && sortedWorkouts.length === 0 && (
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#111] px-6 py-16 text-center">
            <h3 className="font-display text-2xl font-bold uppercase text-white">
              NO WORKOUTS FOUND
            </h3>

            <p className="mt-2 text-sm text-[#8a8a8a]">
              We couldn&apos;t load the workout library.
            </p>
          </div>
        )}

        {/* Workout Grid */}
        {!loading && sortedWorkouts.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sortedWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
              />
            ))}
          </div>
        )}
      </div>
      </div>
    </section>
  );
}