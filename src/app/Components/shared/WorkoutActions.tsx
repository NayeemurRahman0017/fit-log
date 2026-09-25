"use client";

import {
  Bookmark,
  CalendarPlus,
  Check,
} from "lucide-react";

import { useApp } from "./AppProvider";

type WorkoutActionsProps = {
  workoutId: number;
};

export default function WorkoutActions({
  workoutId,
}: WorkoutActionsProps) {
  const {
    addToPlan,
    removeFromPlan,
    saveWorkout,
    unsaveWorkout,
    isInPlan,
    isSaved,
  } = useApp();

  const inPlan = isInPlan(workoutId);
  const saved = isSaved(workoutId);

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      {/* PLAN BUTTON */}
      <button
        type="button"
        onClick={() => {
          if (inPlan) {
            removeFromPlan(workoutId);
          } else {
            addToPlan(workoutId);
          }
        }}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-black uppercase tracking-wide transition ${
          inPlan
            ? "bg-[#ccff00] text-black hover:bg-[#d8ff4d]"
            : "bg-[#ccff00] text-black hover:bg-[#d8ff4d]"
        }`}
      >
        {inPlan ? (
          <>
            <Check size={17} />
            Added to plan
          </>
        ) : (
          <>
            <CalendarPlus size={17} />
            Add to today&apos;s plan
          </>
        )}
      </button>

      {/* SAVE BUTTON */}
      <button
        type="button"
        onClick={() => {
          if (saved) {
            unsaveWorkout(workoutId);
          } else {
            saveWorkout(workoutId);
          }
        }}
        className={`inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-black uppercase tracking-wide transition ${
          saved
            ? "border-[#ccff00] bg-[#151515] text-[#ccff00]"
            : "border-[#333] bg-transparent text-white hover:border-[#ccff00]"
        }`}
      >
        <Bookmark
          size={17}
          fill={saved ? "currentColor" : "none"}
        />

        {saved
          ? "Saved"
          : "Save for later"}
      </button>
    </div>
  );
}