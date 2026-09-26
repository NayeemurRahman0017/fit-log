"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Clock3,
  Flame,
  Star,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useApp } from "../Components/shared/AppProvider";
import type { Workout } from "../../types";

type Tab = "plan" | "saved";
type SortBy = "duration" | "calories" | "rating";

type PlanWorkout = {
  workout: Workout;
  done: boolean;
};

export default function MyPlanPage() {
  const {
    workouts,
    loading,
    plan,
    saved,
    toggleDone,
    removeFromPlan,
    unsaveWorkout,
  } = useApp();

  const [activeTab, setActiveTab] =
    useState<Tab>("plan");

  const [sortBy, setSortBy] =
    useState<SortBy>("duration");


  const planWorkouts = useMemo<PlanWorkout[]>(() => {
    const items = plan
      .map((planItem) => {
        const workout = workouts.find(
          (item) => item.id === planItem.id
        );

        if (!workout) {
          return null;
        }

        return {
          workout,
          done: planItem.done,
        };
      })
      .filter(
        (item): item is PlanWorkout =>
          item !== null
      );

    if (sortBy === "duration") {
      items.sort(
        (a, b) =>
          a.workout.duration -
          b.workout.duration
      );
    }

    if (sortBy === "calories") {
      items.sort(
        (a, b) =>
          b.workout.caloriesBurned -
          a.workout.caloriesBurned
      );
    }

    if (sortBy === "rating") {
      items.sort(
        (a, b) =>
          b.workout.rating -
          a.workout.rating
      );
    }

    return items;
  }, [plan, workouts, sortBy]);

  

  const savedWorkouts = useMemo(() => {
    const items = saved
      .map((id) =>
        workouts.find(
          (workout) => workout.id === id
        )
      )
      .filter(
        (workout): workout is Workout =>
          workout !== undefined
      );

    if (sortBy === "duration") {
      items.sort(
        (a, b) =>
          a.duration - b.duration
      );
    }

    if (sortBy === "calories") {
      items.sort(
        (a, b) =>
          b.caloriesBurned -
          a.caloriesBurned
      );
    }

    if (sortBy === "rating") {
      items.sort(
        (a, b) =>
          b.rating - a.rating
      );
    }

    return items;
  }, [saved, workouts, sortBy]);

  

  const totalExercises =
    planWorkouts.length;

  const totalMinutes =
    planWorkouts.reduce(
      (total, item) =>
        total + item.workout.duration,
      0
    );

  const totalCalories =
    planWorkouts.reduce(
      (total, item) =>
        total + item.workout.caloriesBurned,
      0
    );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0b0d] px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-275">

          <h1 className="font-display text-3xl font-black uppercase">
            MY PLAN
          </h1>

          <p className="mt-1 text-[10px] text-[#777b82]">
            Cap of five lifts for today. Finish them,
            then load more.
          </p>

          <div className="mt-7 flex items-center gap-2 text-[11px] text-[#888b91]">
            <span className="h-3 w-3 animate-spin rounded-full border border-[#555] border-t-[#ccff00]" />
            Loading workouts…
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0b0d] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-275">


        <header>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight">
            MY PLAN
          </h1>

          <p className="mt-1 text-[10px] text-[#777b82] sm:text-[11px]">
            Cap of five lifts for today. Finish them,
            then load more.
          </p>
        </header>

        

        <section className="mt-7 overflow-hidden rounded-xl border border-[#22252b] bg-[#14161b]">

          <div className="grid grid-cols-3">

            {}

            <div className="border-r border-[#22252b] px-4 py-4 sm:px-6 sm:py-5">
              <p className="text-[9px] text-[#777b82]">
                Exercises
              </p>

              <p className="mt-1 font-display text-2xl font-black leading-none text-[#ccff00] sm:text-3xl">
                {totalExercises}
              </p>
            </div>

            {}

            <div className="border-r border-[#22252b] px-4 py-4 sm:px-6 sm:py-5">
              <p className="text-[9px] text-[#777b82]">
                Minutes
              </p>

              <p className="mt-1 font-display text-2xl font-black leading-none text-white sm:text-3xl">
                {totalMinutes}
              </p>
            </div>

            {}

            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <p className="text-[9px] text-[#777b82]">
                Calories
              </p>

              <p className="mt-1 font-display text-2xl font-black leading-none text-white sm:text-3xl">
                {totalCalories}
              </p>
            </div>

          </div>

        </section>


        <section className="mt-5 flex items-center justify-between">

          {}

          <div className="flex overflow-hidden rounded-md border border-[#25282e] bg-[#14161b]">

            <button
              type="button"
              onClick={() =>
                setActiveTab("plan")
              }
              className={`px-4 py-2 text-[9px] font-bold transition ${
                activeTab === "plan"
                  ? "bg-[#22252b] text-white"
                  : "text-[#777b82] hover:text-white"
              }`}
            >
              Today&apos;s Plan
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab("saved")
              }
              className={`px-4 py-2 text-[9px] font-bold transition ${
                activeTab === "saved"
                  ? "bg-[#22252b] text-white"
                  : "text-[#777b82] hover:text-white"
              }`}
            >
              Saved
            </button>

          </div>

          {}

          <div className="flex items-center gap-2">

            <span className="hidden text-[9px] text-[#666a70] sm:block">
              Sort By
            </span>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value as SortBy
                )
              }
              className="rounded-md border border-[#292c32] bg-[#14161b] px-2 py-2 text-[9px] text-white outline-none focus:border-[#ccff00]"
            >
              <option value="duration">
                Duration
              </option>

              <option value="calories">
                Calories
              </option>

              <option value="rating">
                Rating
              </option>
            </select>

          </div>

        </section>

    

        {activeTab === "plan" && (
          <section className="mt-3">

            {planWorkouts.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-3">

                {planWorkouts.map(
                  ({ workout, done }) => (
                    <PlanCard
                      key={workout.id}
                      workout={workout}
                      done={done}
                      onDone={() =>
                        toggleDone(
                          workout.id
                        )
                      }
                      onRemove={() =>
                        removeFromPlan(
                          workout.id
                        )
                      }
                    />
                  )
                )}

              </div>
            )}

          </section>
        )}


        {activeTab === "saved" && (
          <section className="mt-3">

            {savedWorkouts.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-3">

                {savedWorkouts.map(
                  (workout) => (
                    <SavedCard
                      key={workout.id}
                      workout={workout}
                      onRemove={() =>
                        unsaveWorkout(
                          workout.id
                        )
                      }
                    />
                  )
                )}

              </div>
            )}

          </section>
        )}

      </div>
    </main>
  );
}

function PlanCard({
  workout,
  done,
  onDone,
  onRemove,
}: {
  workout: Workout;
  done: boolean;
  onDone: () => void;
  onRemove: () => void;
}) {
  return (
    <article
      className={`flex flex-col gap-3 rounded-xl border bg-[#14161b] p-2.5 transition sm:flex-row sm:items-center ${
        done
          ? "border-[#ccff00]/30"
          : "border-[#23262c]"
      }`}
    >


      <div className="relative h-18 w-full shrink-0 overflow-hidden rounded-md bg-[#1a1c21] sm:h-17.5 sm:w-27">

        <Image
          src={workout.image}
          alt={workout.name}
          fill
          sizes="108px"
          className={`object-cover ${
            done ? "opacity-50" : ""
          }`}
        />

        {done && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ccff00] text-black">
              <Check size={15} strokeWidth={3} />
            </div>
          </div>
        )}

      </div>


      <div className="min-w-0 flex-1">

        <div className="flex items-center gap-2">

          <h2
            className={`truncate text-[11px] font-black uppercase tracking-tight ${
              done
                ? "text-[#777] line-through"
                : "text-white"
            }`}
          >
            {workout.name}
          </h2>

          {done && (
            <span className="shrink-0 text-[7px] font-black uppercase text-[#ccff00]">
              Done
            </span>
          )}

        </div>

        <p className="mt-0.5 truncate text-[9px] text-[#777b82]">
          {workout.equipment}
        </p>


        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[8px] text-[#9b9ea4]">

          <span className="flex items-center gap-1">
            <Clock3
              size={10}
              className="text-[#ccff00]"
            />

            {workout.duration} min
          </span>

          <span className="flex items-center gap-1">
            <Flame
              size={10}
              className="text-[#ccff00]"
            />

            {workout.caloriesBurned} kcal
          </span>

          <span className="flex items-center gap-1">
            <Star
              size={10}
              className="text-[#ccff00]"
            />

            {workout.rating}
          </span>

        </div>

      </div>


      <div className="flex shrink-0 items-center gap-2">


        <Link
          href={`/workouts/${workout.id}`}
          className="rounded-md border border-[#30333a] px-3 py-2 text-[8px] font-bold text-white transition hover:border-[#ccff00] hover:text-[#ccff00]"
        >
          View Details
        </Link>


        <button
          type="button"
          onClick={onDone}
          disabled={done}
          className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-[8px] font-black transition ${
            done
              ? "cursor-not-allowed bg-[#292c29] text-[#777]"
              : "bg-[#ccff00] text-black hover:bg-[#d9ff55]"
          }`}
        >
          <Check
            size={11}
            strokeWidth={3}
          />

          {done
            ? "Done"
            : "Mark as Done"}
        </button>


        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${workout.name}`}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#6d7077] transition hover:bg-red-500/10 hover:text-red-400"
        >
          <X size={13} />
        </button>

      </div>

    </article>
  );
}


function SavedCard({
  workout,
  onRemove,
}: {
  workout: Workout;
  onRemove: () => void;
}) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-[#23262c] bg-[#14161b] p-2.5 sm:flex-row sm:items-center">



      <div className="relative h-18 w-full shrink-0 overflow-hidden rounded-md sm:h-17.5 sm:w-27">
        <Image
          src={workout.image}
          alt={workout.name}
          fill
          sizes="108px"
          className="object-cover"
        />
      </div>


      <div className="min-w-0 flex-1">

        <h2 className="truncate text-[11px] font-black uppercase text-white">
          {workout.name}
        </h2>

        <p className="mt-0.5 text-[9px] text-[#777b82]">
          {workout.equipment}
        </p>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[8px] text-[#9b9ea4]">

          <span className="flex items-center gap-1">
            <Clock3 size={10} />
            {workout.duration} min
          </span>

          <span className="flex items-center gap-1">
            <Flame size={10} />
            {workout.caloriesBurned} kcal
          </span>

          <span className="flex items-center gap-1">
            <Star size={10} />
            {workout.rating}
          </span>

        </div>

      </div>


      <div className="flex shrink-0 items-center gap-2">

        <Link
          href={`/workouts/${workout.id}`}
          className="rounded-md border border-[#30333a] px-3 py-2 text-[8px] font-bold text-white transition hover:border-[#ccff00] hover:text-[#ccff00]"
        >
          View Details
        </Link>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${workout.name} from saved`}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#6d7077] transition hover:bg-red-500/10 hover:text-red-400"
        >
          <X size={13} />
        </button>

      </div>

    </article>
  );
}


function EmptyState() {
  return (
    <div className="flex min-h-70 flex-col items-center justify-center rounded-xl border border-dashed border-[#24272d] bg-[#101216] px-5 text-center">

      <h2 className="font-display text-sm font-black uppercase tracking-wide text-white">
        NOTHING HERE YET
      </h2>

      <p className="mt-2 text-[9px] text-[#666a70]">
        Browse the library and add a lift to get today moving.
      </p>

      <Link
        href="/"
        className="mt-5 rounded-full bg-[#ccff00] px-5 py-2.5 text-[9px] font-black text-black shadow-[0_0_18px_rgba(204,255,0,0.15)] transition hover:bg-[#d9ff55]"
      >
        Go to workouts
      </Link>

    </div>
  );
}