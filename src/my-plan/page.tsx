"use client";

import Link from "next/link";
import Image from "next/image";

import {
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  Check,
  Clock3,
  Flame,
  Star,
  X,
} from "lucide-react";

import { useApp } from "@/app/Components/shared/AppProvider";

import type { Workout } from "../types";

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
    removeFromPlan,
    toggleDone,
    unsaveWorkout,
  } = useApp();

  const [tab, setTab] =
    useState<"plan" | "saved">("plan");

  /*
   * Plan workouts
   */
  const planWorkouts = useMemo<
    PlanWorkout[]
  >(
    () =>
      plan
        .map((item: { id: number; done: boolean }) => ({
          workout: workouts.find(
            (workout: Workout) =>
              workout.id === item.id
          ),
          done: item.done,
        }))
        .filter(
          (
            item: {
              workout: Workout | undefined;
              done: boolean;
            }
          ): item is PlanWorkout =>
            Boolean(item.workout)
        ),
    [plan, workouts]
  );

  /*
   * Saved workouts
   */
  const savedWorkouts = useMemo<Workout[]>(
    () =>
      saved
        .map((id: number) =>
          workouts.find(
            (workout: Workout) =>
              workout.id === id
          )
        )
        .filter(
          (workout: Workout | undefined): workout is Workout =>
            Boolean(workout)
        ),
    [saved, workouts]
  );

  /*
   * Metrics
   */
  const metrics = useMemo(
    () =>
      planWorkouts.reduce(
        (acc, item: PlanWorkout) => ({
          minutes:
            acc.minutes +
            item.workout.duration,

          calories:
            acc.calories +
            item.workout.caloriesBurned,
        }),
        {
          minutes: 0,
          calories: 0,
        }
      ),
    [planWorkouts]
  );

  return (
    <section className="container-fit py-10 sm:py-14">
      {/* Header */}
      <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">
            Your log
          </p>

          <h1 className="display mt-2 text-6xl font-bold uppercase leading-none">
            My Plan
          </h1>

          <p className="mt-3 max-w-lg text-sm text-white/45">
            Cap of five lifts for today. Finish
            them, then load more.
          </p>
        </div>

        <Link
          href="/#library"
          className="button-ghost"
        >
          Add a workout
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Metrics */}
      <div className="mt-9 grid gap-3 sm:grid-cols-3">
        <Metric
          label="Exercises"
          value={plan.length}
        />

        <Metric
          label="Minutes"
          value={metrics.minutes}
        />

        <Metric
          label="Calories"
          value={metrics.calories}
        />
      </div>

      {/* Tabs */}
      <div className="mt-10 flex gap-1 border-b border-white/10">
        <button
          type="button"
          onClick={() => setTab("plan")}
          className={`rounded-t-xl px-5 py-3 text-xs font-bold uppercase tracking-[.12em] ${
            tab === "plan"
              ? "bg-white text-ink"
              : "text-white/45 hover:text-white"
          }`}
        >
          Today&apos;s Plan

          <span className="ml-1">
            {plan.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab("saved")}
          className={`rounded-t-xl px-5 py-3 text-xs font-bold uppercase tracking-[.12em] ${
            tab === "saved"
              ? "bg-white text-ink"
              : "text-white/45 hover:text-white"
          }`}
        >
          Saved

          <span className="ml-1">
            {saved.length}
          </span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid min-h-90 place-items-center text-sm text-white/50">
          Loading workouts…
        </div>
      ) : tab === "plan" ? (
        <PlanList
          items={planWorkouts}
          onRemove={removeFromPlan}
          onDone={toggleDone}
        />
      ) : (
        <SavedList
          items={savedWorkouts}
          onRemove={unsaveWorkout}
        />
      )}
    </section>
  );
}

/*
 * Metric card
 */
function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="card p-5">
      <p className="text-[10px] font-bold uppercase tracking-[.18em] text-white/35">
        {label}
      </p>

      <p className="display mt-2 text-4xl font-bold text-acid">
        {value}
      </p>
    </div>
  );
}

/*
 * Plan list
 */
function PlanList({
  items,
  onRemove,
  onDone,
}: {
  items: PlanWorkout[];
  onRemove: (id: number) => void;
  onDone: (id: number) => void;
}) {
  if (!items.length) {
    return <Empty />;
  }

  return (
    <div className="mt-6 space-y-3">
      {items.map(
        ({ workout, done }) => (
          <WorkoutRow
            key={workout.id}
            workout={workout}
            done={done}
            onRemove={onRemove}
            onDone={onDone}
          />
        )
      )}
    </div>
  );
}

/*
 * Saved list
 */
function SavedList({
  items,
  onRemove,
}: {
  items: Workout[];
  onRemove: (id: number) => void;
}) {
  if (!items.length) {
    return <Empty saved />;
  }

  return (
    <div className="mt-6 space-y-3">
      {items.map((workout) => (
        <WorkoutRow
          key={workout.id}
          workout={workout}
          onRemove={onRemove}
          saved
        />
      ))}
    </div>
  );
}

/*
 * Workout row
 */
function WorkoutRow({
  workout,
  done,
  onRemove,
  onDone,
  saved,
}: {
  workout: Workout;
  done?: boolean;
  onRemove: (id: number) => void;
  onDone?: (id: number) => void;
  saved?: boolean;
}) {
  return (
    <div
      className={`card flex flex-col gap-4 p-3 sm:flex-row sm:items-center ${
        done ? "opacity-60" : ""
      }`}
    >
      {/* Thumbnail */}
      <Image
        src={workout.image}
        alt={workout.name}
        width={128}
        height={96}
        className="h-32 w-full rounded-xl object-cover sm:h-24 sm:w-32"
      />

      {/* Info */}
      <div className="min-w-0 flex-1 px-1">
        <div className="flex flex-wrap gap-1.5">
          {workout.muscleGroups
            .slice(0, 2)
            .map((tag) => (
              <span
                className="pill"
                key={tag}
              >
                {tag}
              </span>
            ))}
        </div>

        <h3
          className={`display mt-2 text-xl font-bold uppercase ${
            done ? "line-through" : ""
          }`}
        >
          {workout.name}
        </h3>

        <p className="mt-1 truncate text-xs text-white/40">
          {workout.equipment}
        </p>

        <div className="mt-3 flex flex-wrap gap-4 text-[10px] font-semibold text-white/45">
          <span className="flex items-center gap-1">
            <Clock3 size={12} />
            {workout.duration} min
          </span>

          <span className="flex items-center gap-1">
            <Flame size={12} />
            {workout.caloriesBurned} kcal
          </span>

          <span className="flex items-center gap-1">
            <Star
              size={12}
              className="fill-current text-acid"
            />
            {workout.rating}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 sm:w-62.5 sm:justify-end">
        <Link
          href={`/workouts/${workout.id}`}
          className="button-ghost px-4 py-2"
        >
          View details
        </Link>

        {saved ? (
          <button
            type="button"
            onClick={() =>
              onRemove(workout.id)
            }
            className="button-ghost px-4 py-2"
          >
            <X size={14} />
            Remove
          </button>
        ) : (
          <>
            <button
              type="button"
              disabled={done}
              onClick={() =>
                onDone?.(workout.id)
              }
              className={`button-acid px-4 py-2 ${
                done
                  ? "cursor-default opacity-50"
                  : ""
              }`}
            >
              <Check size={14} />

              {done
                ? "Done"
                : "Mark as done"}
            </button>

            <button
              type="button"
              onClick={() =>
                onRemove(workout.id)
              }
              aria-label="Remove"
              className="grid size-10 place-items-center rounded-full border border-white/15 text-white/60 hover:border-red-400 hover:text-red-300"
            >
              <X size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/*
 * Empty state
 */
function Empty({
  saved = false,
}: {
  saved?: boolean;
}) {
  return (
    <div className="mt-6 rounded-3xl border border-dashed border-white/15 py-20 text-center">
      <p className="eyebrow">
        Nothing here yet
      </p>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/40">
        {saved
          ? "Save a workout from the library to keep it handy for later."
          : "Browse the library and add a lift to get today moving."}
      </p>

      <Link
        href="/#library"
        className="button-acid mt-7"
      >
        Go to workouts
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}