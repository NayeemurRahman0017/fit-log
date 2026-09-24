"use client";



import Link from "next/link";
import Image from "next/image";

import {
  Clock3,
  Flame,
  Star,
} from "../shared/icons";

import type { Workout } from "../../../types";

export function WorkoutCard({
  workout,
}: {
  workout: Workout;
}) {
  return (
    <Link
      href={`/workouts/${workout.id}`}
      className="group card overflow-hidden transition hover:-translate-y-1 hover:border-acid/50"
    >
      {/* Image */}
      <div className="relative aspect-16/10 overflow-hidden bg-[#191919]">
        <Image
          src={workout.image}
          alt={workout.name}
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/55 to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
          {workout.muscleGroups
            .slice(0, 2)
            .map((tag: string) => (
              <span
                key={tag}
                className="pill bg-black/50 text-white backdrop-blur"
              >
                {tag}
              </span>
            ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="display text-xl font-bold uppercase leading-tight">
          {workout.name}
        </h3>

        <p className="mt-2 truncate text-xs text-white/45">
          {workout.equipment}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] font-semibold text-white/50">
          <span className="flex items-center gap-1.5">
            <Clock3 size={13} />
            {workout.duration} min
          </span>

          <span className="flex items-center gap-1.5">
            <Flame size={13} />
            {workout.caloriesBurned} kcal
          </span>

          <span className="flex items-center gap-1.5 text-white">
            <Star
              size={13}
              className="fill-current text-acid"
            />
            {workout.rating}
          </span>
        </div>
      </div>
    </Link>
  );
}