"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Clock3,
  Flame,
  Star,
  Dumbbell,
  CheckCircle2,
} from "lucide-react";
import { useParams } from "next/navigation";

import type { Workout } from "../../../types";
import WorkoutActions from "../../Components/shared/WorkoutActions";

const API_URL = "https://api.abcz.workers.dev/api/fitlog";

export default function WorkoutDetailsPage() {
  const params = useParams();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWorkout = async () => {
      try {
        setLoading(true);
        setError("");

        const id = params.id;

        if (!id) {
          throw new Error("Workout ID not found");
        }

        // Single workout API
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

        const data: Workout = await response.json();

        setWorkout(data);
      } catch (err) {
        console.error("Workout loading error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [params.id]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#090909] px-4 py-10 text-white sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="h-5 w-32 animate-pulse rounded bg-[#222]" />

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div className="aspect-[16/10] animate-pulse rounded-2xl bg-[#151515]" />

            <div className="space-y-5">
              <div className="h-10 w-3/4 animate-pulse rounded bg-[#151515]" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-[#151515]" />
              <div className="h-24 animate-pulse rounded bg-[#151515]" />
              <div className="h-14 animate-pulse rounded bg-[#151515]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ================= ERROR ================= */

  if (error || !workout) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090909] px-5 text-white">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#ccff00]">
            404
          </p>

          <h1 className="mt-3 text-3xl font-black uppercase">
            Workout Not Found
          </h1>

          <p className="mt-3 text-sm text-[#777]">
            {error || "The workout could not be loaded."}
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#ccff00] px-6 py-3 text-sm font-black uppercase text-black"
          >
            <ArrowLeft size={17} />
            Back to workouts
          </Link>
        </div>
      </main>
    );
  }

  /* ================= DETAILS ================= */

  return (
    <main className="min-h-screen bg-[#090909] px-4 py-10 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* BACK BUTTON */}

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#888] transition hover:text-[#ccff00]"
        >
          <ArrowLeft size={17} />
          Back to workouts
        </Link>

        {/* MAIN */}

        <section className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">

          {/* IMAGE */}

          <div className="relative overflow-hidden rounded-2xl border border-[#292929] bg-[#111]">
            <div className="relative aspect-[16/10]">
              <Image
                src={workout.image}
                alt={workout.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* INFO */}

          <div>

            {/* TAGS */}

            <div className="flex flex-wrap gap-2">
              {workout.muscleGroups.map(
                (muscle: Workout["muscleGroups"][number]) => (
                  <span
                    key={muscle}
                    className="rounded-full bg-[#ccff00] px-3 py-1 text-[10px] font-black uppercase text-black"
                  >
                    {muscle}
                  </span>
                )
              )}
            </div>

            {/* TITLE */}

            <h1 className="mt-5 font-display text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl lg:text-6xl">
              {workout.name}
            </h1>

            {/* EQUIPMENT */}

            <div className="mt-4 flex items-center gap-2 text-sm text-[#888]">
              <Dumbbell size={17} />
              {workout.equipment}
            </div>

            {/* STATS */}

            <div className="mt-8 grid grid-cols-3 gap-3">

              <div className="rounded-xl border border-[#292929] bg-[#111] p-4">
                <Clock3
                  size={18}
                  className="text-[#ccff00]"
                />

                <p className="mt-3 text-xl font-black">
                  {workout.duration}
                </p>

                <p className="text-[10px] font-bold uppercase text-[#777]">
                  Minutes
                </p>
              </div>

              <div className="rounded-xl border border-[#292929] bg-[#111] p-4">
                <Flame
                  size={18}
                  className="text-[#ccff00]"
                />

                <p className="mt-3 text-xl font-black">
                  {workout.caloriesBurned}
                </p>

                <p className="text-[10px] font-bold uppercase text-[#777]">
                  Calories
                </p>
              </div>

              <div className="rounded-xl border border-[#292929] bg-[#111] p-4">
                <Star
                  size={18}
                  className="text-[#ccff00]"
                />

                <p className="mt-3 text-xl font-black">
                  {workout.rating}
                </p>

                <p className="text-[10px] font-bold uppercase text-[#777]">
                  Rating
                </p>
              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="mt-8">
              <h2 className="text-sm font-black uppercase tracking-[0.15em] text-[#ccff00]">
                About this workout
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#999]">
                {workout.description}
              </p>
            </div>

            {/* ACTION BUTTONS */}

            <WorkoutActions
              workoutId={workout.id}
            />

          </div>
        </section>

        {/* ================= WORKOUT INFO ================= */}

        <section className="mt-16 grid gap-8 lg:grid-cols-2">

          {/* SETS & REPS */}

          <div className="rounded-2xl border border-[#292929] bg-[#111] p-6">
            <h2 className="font-display text-2xl font-black uppercase">
              Workout Details
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-4">

              <div className="rounded-xl bg-[#181818] p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#777]">
                  Difficulty
                </p>

                <p className="mt-2 text-lg font-black uppercase text-[#ccff00]">
                  {workout.difficulty}
                </p>
              </div>

              <div className="rounded-xl bg-[#181818] p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#777]">
                  Sets
                </p>

                <p className="mt-2 text-lg font-black">
                  {workout.sets}
                </p>
              </div>

              <div className="rounded-xl bg-[#181818] p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#777]">
                  Reps
                </p>

                <p className="mt-2 text-lg font-black">
                  {workout.reps}
                </p>
              </div>

              <div className="rounded-xl bg-[#181818] p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#777]">
                  Equipment
                </p>

                <p className="mt-2 text-sm font-bold">
                  {workout.equipment}
                </p>
              </div>

            </div>
          </div>

          {/* INSTRUCTIONS */}

          <div className="rounded-2xl border border-[#292929] bg-[#111] p-6">
            <h2 className="font-display text-2xl font-black uppercase">
              Instructions
            </h2>

            <div className="mt-6 space-y-4">
              {workout.instructions.map(
                (instruction: string, index: number) => (
                  <div
                    key={index}
                    className="flex gap-4 rounded-xl bg-[#181818] p-4"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ccff00] text-xs font-black text-black">
                      {index + 1}
                    </div>

                    <p className="text-sm leading-6 text-[#aaa]">
                      {instruction}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

        </section>

      </div>
    </main>
  );
}