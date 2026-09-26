"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  
  Star,
} from "lucide-react";
import { useParams } from "next/navigation";

import type { Workout } from "../../../types";
import WorkoutActions from "../../Components/shared/WorkoutActions";

const API_URL =
  "https://api.abcz.workers.dev/api/fitlog";

export default function WorkoutDetailsPage() {
  const params = useParams();

  const [workout, setWorkout] =
    useState<Workout | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  

  useEffect(() => {
    async function loadWorkout() {
      try {
        setLoading(true);
        setError(null);

        const id = params.id;

        if (!id) {
          throw new Error(
            "Workout ID is missing."
          );
        }

        const response = await fetch(
          `${API_URL}/${id}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Workout not found: ${response.status}`
          );
        }

        const data: Workout =
          await response.json();

        setWorkout(data);
      } catch (err) {
        console.error(
          "Workout loading error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load workout."
        );
      } finally {
        setLoading(false);
      }
    }

    loadWorkout();
  }, [params.id]);

  

  if (loading) {
    return <WorkoutDetailsSkeleton />;
  }

  

  if (error || !workout) {
    return (
      <main className="min-h-screen bg-[#0a0b0d] px-5 py-10 text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#ccff00]">
            404
          </p>

          <h1 className="mt-3 font-display text-3xl font-black uppercase">
            Workout Not Found
          </h1>

          <p className="mt-3 max-w-md text-sm text-[#777]">
            {error ||
              "The requested workout could not be loaded."}
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#ccff00] px-5 py-3 text-xs font-black uppercase text-black"
          >
            <ArrowLeft size={15} />
            Back to workouts
          </Link>
        </div>
      </main>
    );
  }

 

  return (
    <main className="min-h-screen bg-[#0a0b0d] text-white">

      <div className="mx-auto max-w-300 px-4 py-7 sm:px-6 lg:px-8">

       
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-[10px] font-bold text-[#73767c] transition hover:text-[#ccff00]"
        >
          <ArrowLeft size={13} />
          Back to workouts
        </Link>

        

        <div className="grid gap-7 lg:grid-cols-[1fr_1fr]">


          <div className="relative h-75 overflow-hidden rounded-lg bg-[#15171b] sm:h-107.5 lg:h-125">
            <Image
              src={workout.image}
              alt={workout.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>


          <div className="flex flex-col">

            

            <h1 className="font-display text-3xl font-black uppercase leading-[0.95] tracking-tight sm:text-4xl">
              {workout.name}
            </h1>


            <p className="mt-2 max-w-xl text-[10px] leading-5 text-[#85888e] sm:text-[11px]">
              {workout.description}
            </p>


            <div className="mt-4 flex flex-wrap gap-2">
              {workout.muscleGroups.map(
                (muscle) => (
                  <span
                    key={muscle}
                    className="rounded-full bg-[#ccff00] px-3 py-1 text-[8px] font-black uppercase tracking-wide text-black"
                  >
                    {muscle}
                  </span>
                )
              )}
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-[#22252b] bg-[#14161b]">

              <InfoRow
                label="Equipment"
                value={workout.equipment}
              />

              <InfoRow
                label="Difficulty"
                value={workout.difficulty}
              />

              <InfoRow
                label="Sets"
                value={String(workout.sets)}
              />

              <InfoRow
                label="Reps"
                value={workout.reps}
              />

              <InfoRow
                label="Duration"
                value={`${workout.duration} min`}
              />

              <InfoRow
                label="Calories"
                value={`${workout.caloriesBurned} kcal`}
              />

              <InfoRow
                label="Rating"
                value={
                  <span className="flex items-center justify-end gap-1">
                    <Star
                      size={10}
                      className="fill-[#ccff00] text-[#ccff00]"
                    />
                    {workout.rating}
                  </span>
                }
              />

            </div>


            <div className="mt-5">

              <h2 className="text-[10px] font-black uppercase tracking-[0.12em] text-white">
                Instructions
              </h2>

              <div className="mt-2 space-y-1.5">

                {workout.instructions.map(
                  (instruction, index) => (
                    <div
                      key={index}
                      className="flex gap-2 text-[9px] leading-4 text-[#85888e]"
                    >
                      <span className="shrink-0 text-[#777]">
                        {index + 1}.
                      </span>

                      <p>{instruction}</p>
                    </div>
                  )
                )}

              </div>

            </div>


            <WorkoutActions
              workoutId={workout.id}
            />

          </div>
        </div>

      </div>
    </main>
  );
}



function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex min-h-7 items-center justify-between border-b border-[#202329] px-3 last:border-b-0">
      <span className="text-[8px] font-bold uppercase tracking-[0.08em] text-[#777b82]">
        {label}
      </span>

      <span className="text-right text-[8px] font-medium text-[#d1d3d6]">
        {value}
      </span>
    </div>
  );
}



function WorkoutDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-[#0a0b0d] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-300">

        <div className="h-3 w-28 animate-pulse rounded bg-[#181a1f]" />

        <div className="mt-6 grid gap-7 lg:grid-cols-2">

          <div className="h-75 animate-pulse rounded-lg bg-[#15171b] sm:h-107.5 lg:h-125" />

          <div className="space-y-4">

            <div className="h-10 w-3/4 animate-pulse rounded bg-[#15171b]" />

            <div className="h-10 w-full animate-pulse rounded bg-[#15171b]" />

            <div className="h-6 w-40 animate-pulse rounded bg-[#15171b]" />

            <div className="h-55 animate-pulse rounded-lg bg-[#15171b]" />

            <div className="h-20 animate-pulse rounded bg-[#15171b]" />

            <div className="h-10 w-60 animate-pulse rounded bg-[#15171b]" />

          </div>

        </div>
      </div>
    </main>
  );
}