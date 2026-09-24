"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3, Flame, Star } from "lucide-react";

import type { Workout } from "../../../types";

type WorkoutCardProps = {
  workout: Workout;
};

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <Link
      href={`/workouts/${workout.id}`}
      className="group block overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#111111] transition-all duration-300 hover:-translate-y-1 hover:border-[#ccff00]"
    >
      {/* Image */}
      <div className="relative aspect-16/10 overflow-hidden bg-[#191919]">
        <Image
          src={workout.image}
          alt={workout.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Muscle tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {workout.muscleGroups.map((muscle: string) => (
            <span
              key={muscle}
              className="rounded-full bg-[#ccff00] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-black"
            >
              {muscle}
            </span>
          ))}
        </div>

        {/* Name */}
        <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white">
          {workout.name}
        </h3>

        {/* Equipment */}
        <p className="mt-1 text-sm text-[#8a8a8a]">
          {workout.equipment}
        </p>

        {/* Divider */}
        <div className="my-4 h-px bg-[#2a2a2a]" />

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-[#b5b5b5]">
            
          <div className="flex items-center gap-3">
            <Clock3 size={14} />
            {workout.duration} min
        
          </div>

          <div className="flex items-center gap-3">
            <Flame size={14} />
            {workout.caloriesBurned} kcal
          
          </div>
        

          <div className="flex items-center gap-3">
            <Star size={14} />
            {workout.rating}
        
          </div>
        </div>
      </div>
    </Link>
  );
}