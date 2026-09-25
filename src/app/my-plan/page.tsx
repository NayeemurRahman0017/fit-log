"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Clock3,
  Flame,
  Star,
  Trash2,
  Dumbbell,
} from "lucide-react";

import { useApp } from "../Components/shared/AppProvider";
import type { Workout } from "../../types";

type Tab = "plan" | "saved";
type SortOption = "default" | "duration" | "calories" | "rating";

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

  const [activeTab, setActiveTab] = useState<Tab>("plan");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  /*
   * Plan-এর ID থেকে actual workout বের করছি।
   * এখানে নতুন API call করার দরকার নেই।
   */
  const planWorkouts = useMemo<PlanWorkout[]>(() => {
    return plan
      .map((item) => {
        const workout = workouts.find(
          (workoutItem) => workoutItem.id === item.id
        );

        if (!workout) {
          return null;
        }

        return {
          workout,
          done: item.done,
        };
      })
      .filter((item): item is PlanWorkout => item !== null);
  }, [plan, workouts]);

  /*
   * Saved workout list
   */
  const savedWorkouts = useMemo(() => {
    return saved
      .map((id) => workouts.find((workout) => workout.id === id))
      .filter((workout): workout is Workout => workout !== undefined);
  }, [saved, workouts]);

  /*
   * Sorting
   */
  const sortedPlanWorkouts = useMemo(() => {
    const items = [...planWorkouts];

    if (sortBy === "duration") {
      items.sort(
        (a, b) => a.workout.duration - b.workout.duration
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
        (a, b) => b.workout.rating - a.workout.rating
      );
    }

    return items;
  }, [planWorkouts, sortBy]);

  const sortedSavedWorkouts = useMemo(() => {
    const items = [...savedWorkouts];

    if (sortBy === "duration") {
      items.sort(
        (a, b) => a.duration - b.duration
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
        (a, b) => b.rating - a.rating
      );
    }

    return items;
  }, [savedWorkouts, sortBy]);

  /*
   * Plan statistics
   */
  const totalMinutes = useMemo(() => {
    return planWorkouts.reduce(
      (total, item) =>
        total + item.workout.duration,
      0
    );
  }, [planWorkouts]);

  const totalCalories = useMemo(() => {
    return planWorkouts.reduce(
      (total, item) =>
        total + item.workout.caloriesBurned,
      0
    );
  }, [planWorkouts]);

  const completedCount = useMemo(() => {
    return planWorkouts.filter(
      (item) => item.done
    ).length;
  }, [planWorkouts]);

  /*
   * Loading
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#090909] px-4 py-10 text-white sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="h-12 w-64 animate-pulse rounded-lg bg-[#1b1b1b]" />

          <div className="mt-4 h-5 w-96 max-w-full animate-pulse rounded bg-[#1b1b1b]" />

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </main>
    );
  }

  const isPlanTab = activeTab === "plan";

  return (
    <main className="min-h-screen bg-[#090909] px-4 py-10 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}
        <section>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-[#ccff00]">
                FITLOG / MY WORKOUT
              </p>

              <h1 className="font-display text-4xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl">
                MY PLAN
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8b8b8b] sm:text-base">
                Manage your workouts, track your progress,
                and keep your training plan organized.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#ccff00] px-5 py-3 text-sm font-black uppercase tracking-wide text-black transition hover:bg-[#d8ff4d]"
            >
              Browse workouts
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Exercises"
            value={planWorkouts.length}
            icon={<Dumbbell size={20} />}
          />

          <StatCard
            label="Total Minutes"
            value={totalMinutes}
            icon={<Clock3 size={20} />}
          />

          <StatCard
            label="Calories"
            value={totalCalories}
            icon={<Flame size={20} />}
          />

          <StatCard
            label="Completed"
            value={`${completedCount}/${planWorkouts.length}`}
            icon={<Check size={20} />}
          />
        </section>

        {/* ================= TABS + SORT ================= */}
        <section className="mt-12">
          <div className="flex flex-col gap-5 border-b border-[#262626] pb-4 sm:flex-row sm:items-center sm:justify-between">

            {/* Tabs */}
            <div className="flex gap-6">
              <button
                type="button"
                onClick={() => setActiveTab("plan")}
                className={`relative pb-3 text-sm font-black uppercase tracking-wide transition ${
                  activeTab === "plan"
                    ? "text-[#ccff00]"
                    : "text-[#777] hover:text-white"
                }`}
              >
                Today&apos;s Plan
                <span className="ml-2 rounded-full bg-[#222] px-2 py-1 text-[10px] text-white">
                  {plan.length}
                </span>

                {activeTab === "plan" && (
                  <span className="absolute bottom-[-17px] left-0 h-[2px] w-full bg-[#ccff00]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("saved")}
                className={`relative pb-3 text-sm font-black uppercase tracking-wide transition ${
                  activeTab === "saved"
                    ? "text-[#ccff00]"
                    : "text-[#777] hover:text-white"
                }`}
              >
                Saved
                <span className="ml-2 rounded-full bg-[#222] px-2 py-1 text-[10px] text-white">
                  {saved.length}
                </span>

                {activeTab === "saved" && (
                  <span className="absolute bottom-[-17px] left-0 h-[2px] w-full bg-[#ccff00]" />
                )}
              </button>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as SortOption)
              }
              className="rounded-lg border border-[#2a2a2a] bg-[#111] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white outline-none focus:border-[#ccff00]"
            >
              <option value="default">
                Sort: Default
              </option>

              <option value="duration">
                Sort: Duration
              </option>

              <option value="calories">
                Sort: Calories
              </option>

              <option value="rating">
                Sort: Rating
              </option>
            </select>
          </div>
        </section>

        {/* ================= CONTENT ================= */}
        <section className="mt-8">

          {/* PLAN */}
          {isPlanTab && (
            <>
              {sortedPlanWorkouts.length === 0 ? (
                <EmptyState
                  title="NOTHING HERE YET"
                  description="Your workout plan is empty. Add some workouts and start training."
                />
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {sortedPlanWorkouts.map(
                    ({ workout, done }) => (
                      <PlanCard
                        key={workout.id}
                        workout={workout}
                        done={done}
                        onDone={() =>
                          toggleDone(workout.id)
                        }
                        onRemove={() =>
                          removeFromPlan(workout.id)
                        }
                      />
                    )
                  )}
                </div>
              )}
            </>
          )}

          {/* SAVED */}
          {!isPlanTab && (
            <>
              {sortedSavedWorkouts.length === 0 ? (
                <EmptyState
                  title="NOTHING SAVED YET"
                  description="Save workouts for later and they will appear here."
                />
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {sortedSavedWorkouts.map(
                    (workout) => (
                      <SavedCard
                        key={workout.id}
                        workout={workout}
                        onRemove={() =>
                          unsaveWorkout(workout.id)
                        }
                      />
                    )
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#252525] bg-[#111111] p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#777]">
          {label}
        </span>

        <span className="text-[#ccff00]">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-3xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   PLAN CARD
========================================================= */

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
      className={`group overflow-hidden rounded-2xl border bg-[#111111] transition ${
        done
          ? "border-[#ccff00]/50"
          : "border-[#292929] hover:border-[#ccff00]"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#191919]">
        <Image
          src={workout.image}
          alt={workout.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition duration-500 group-hover:scale-105 ${
            done ? "opacity-60" : ""
          }`}
        />

        {/* Done badge */}
        {done && (
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[#ccff00] px-3 py-2 text-[10px] font-black uppercase text-black">
            <Check size={13} />
            Completed
          </div>
        )}

        {/* Delete */}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${workout.name}`}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">

        {/* Muscle tags */}
        <div className="mb-3 flex flex-wrap gap-2">
          {workout.muscleGroups.map((muscle) => (
            <span
              key={muscle}
              className="rounded-full bg-[#ccff00] px-3 py-1 text-[9px] font-black uppercase text-black"
            >
              {muscle}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2
          className={`font-display text-xl font-black uppercase tracking-tight ${
            done
              ? "text-[#8c8c8c] line-through"
              : "text-white"
          }`}
        >
          {workout.name}
        </h2>

        <p className="mt-1 text-sm text-[#777]">
          {workout.equipment}
        </p>

        {/* Divider */}
        <div className="my-4 h-px bg-[#282828]" />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs text-[#aaa]">
          <div className="flex items-center gap-2">
            <Clock3 size={14} />
            <span>{workout.duration}m</span>
          </div>

          <div className="flex items-center gap-2">
            <Flame size={14} />
            <span>{workout.caloriesBurned}</span>
          </div>

          <div className="flex items-center gap-2">
            <Star size={14} />
            <span>{workout.rating}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            href={`/workouts/${workout.id}`}
            className="flex items-center justify-center rounded-xl border border-[#333] px-3 py-3 text-[11px] font-black uppercase tracking-wide text-white transition hover:border-[#ccff00] hover:text-[#ccff00]"
          >
            View Details
          </Link>

          <button
            type="button"
            onClick={onDone}
            disabled={done}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-[11px] font-black uppercase tracking-wide transition ${
              done
                ? "cursor-default bg-[#242424] text-[#777]"
                : "bg-[#ccff00] text-black hover:bg-[#d8ff4d]"
            }`}
          >
            {done ? (
              <>
                <Check size={14} />
                Done
              </>
            ) : (
              "Mark as Done"
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   SAVED CARD
========================================================= */

function SavedCard({
  workout,
  onRemove,
}: {
  workout: Workout;
  onRemove: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#292929] bg-[#111111] transition hover:border-[#ccff00]">

      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#191919]">
        <Image
          src={workout.image}
          alt={workout.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Remove */}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${workout.name} from saved`}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">

        <div className="mb-3 flex flex-wrap gap-2">
          {workout.muscleGroups.map((muscle) => (
            <span
              key={muscle}
              className="rounded-full bg-[#ccff00] px-3 py-1 text-[9px] font-black uppercase text-black"
            >
              {muscle}
            </span>
          ))}
        </div>

        <h2 className="font-display text-xl font-black uppercase tracking-tight text-white">
          {workout.name}
        </h2>

        <p className="mt-1 text-sm text-[#777]">
          {workout.equipment}
        </p>

        <div className="my-4 h-px bg-[#282828]" />

        <div className="grid grid-cols-3 gap-2 text-xs text-[#aaa]">
          <div className="flex items-center gap-2">
            <Clock3 size={14} />
            <span>{workout.duration}m</span>
          </div>

          <div className="flex items-center gap-2">
            <Flame size={14} />
            <span>{workout.caloriesBurned}</span>
          </div>

          <div className="flex items-center gap-2">
            <Star size={14} />
            <span>{workout.rating}</span>
          </div>
        </div>

        <Link
          href={`/workouts/${workout.id}`}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ccff00] px-4 py-3 text-[11px] font-black uppercase tracking-wide text-black transition hover:bg-[#d8ff4d]"
        >
          View Details
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#303030] bg-[#0e0e0e] px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#191919] text-[#ccff00]">
        <Dumbbell size={28} />
      </div>

      <h2 className="mt-6 font-display text-2xl font-black uppercase text-white sm:text-3xl">
        {title}
      </h2>

      <p className="mt-3 max-w-md text-sm leading-6 text-[#777]">
        {description}
      </p>

      <Link
        href="/"
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#ccff00] px-6 py-3 text-xs font-black uppercase tracking-wide text-black transition hover:bg-[#d8ff4d]"
      >
        Go to workouts
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

/* =========================================================
   LOADING SKELETONS
========================================================= */

function StatSkeleton() {
  return (
    <div className="h-28 animate-pulse rounded-2xl bg-[#151515]" />
  );
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#202020] bg-[#111]">
      <div className="aspect-[16/10] animate-pulse bg-[#1a1a1a]" />

      <div className="space-y-4 p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-[#222]" />

        <div className="h-6 w-3/4 animate-pulse rounded bg-[#222]" />

        <div className="h-3 w-1/2 animate-pulse rounded bg-[#222]" />

        <div className="h-px w-full bg-[#222]" />

        <div className="h-4 w-full animate-pulse rounded bg-[#222]" />

        <div className="grid grid-cols-2 gap-3">
          <div className="h-11 animate-pulse rounded-xl bg-[#222]" />
          <div className="h-11 animate-pulse rounded-xl bg-[#222]" />
        </div>
      </div>
    </div>
  );
}