"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { PlanItem, Workout } from "@/types";

const API_URL =
  "https://api.abcz.workers.dev/api/fitlog";

const PLAN_KEY = "fitlog-plan-v1";
const SAVED_KEY = "fitlog-saved-v1";

type Toast = {
  id: number;
  message: string;
} | null;

type ContextValue = {
  workouts: Workout[];
  loading: boolean;
  error: string | null;

  plan: PlanItem[];
  saved: number[];

  toast: Toast;

  addToPlan: (id: number) => void;
  removeFromPlan: (id: number) => void;
  toggleDone: (id: number) => void;

  saveWorkout: (id: number) => void;
  unsaveWorkout: (id: number) => void;

  isInPlan: (id: number) => boolean;
  isSaved: (id: number) => boolean;
};

const AppContext =
  createContext<ContextValue | null>(null);

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [workouts, setWorkouts] =
    useState<Workout[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [plan, setPlan] =
    useState<PlanItem[]>([]);

  const [saved, setSaved] =
    useState<number[]>([]);

  const [toast, setToast] =
    useState<Toast>(null);

  const [hydrated, setHydrated] =
    useState(false);

  // --------------------------------
  // LOAD DATA FROM LOCAL STORAGE
  // --------------------------------

  useEffect(() => {
    try {
      const savedPlan =
        localStorage.getItem(PLAN_KEY);

      const savedItems =
        localStorage.getItem(SAVED_KEY);

      if (savedPlan) {
        const parsedPlan: unknown =
          JSON.parse(savedPlan);

        if (Array.isArray(parsedPlan)) {
          const validPlan =
            parsedPlan.filter(
              (item): item is PlanItem =>
                typeof item === "object" &&
                item !== null &&
                "id" in item &&
                "done" in item &&
                typeof item.id === "number" &&
                typeof item.done === "boolean"
            );

          window.setTimeout(() => {
            setPlan(validPlan);
          }, 0);
        }
      }

      if (savedItems) {
        const parsedSaved: unknown =
          JSON.parse(savedItems);

        if (Array.isArray(parsedSaved)) {
          const validSaved =
            parsedSaved.filter(
              (id): id is number =>
                typeof id === "number"
            );

          window.setTimeout(() => {
            setSaved(validSaved);
          }, 0);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load localStorage:",
        error
      );
    } finally {
      window.setTimeout(() => {
        setHydrated(true);
      }, 0);
    }
  }, []);

  // --------------------------------
  // SAVE PLAN TO LOCAL STORAGE
  // --------------------------------

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      PLAN_KEY,
      JSON.stringify(plan)
    );
  }, [plan, hydrated]);

  // --------------------------------
  // SAVE SAVED WORKOUTS
  // --------------------------------

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      SAVED_KEY,
      JSON.stringify(saved)
    );
  }, [saved, hydrated]);

  // --------------------------------
  // FETCH WORKOUTS FROM API
  // --------------------------------

  useEffect(() => {
    const controller =
      new AbortController();

    async function fetchWorkouts() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          API_URL,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch workouts: ${response.status}`
          );
        }

        const data: unknown =
          await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "Invalid workout data received."
          );
        }

        setWorkouts(data as Workout[]);
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Workout API error:",
          error
        );

        setWorkouts([]);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load workouts."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchWorkouts();

    return () => {
      controller.abort();
    };
  }, []);

  // --------------------------------
  // TOAST
  // --------------------------------

  const showToast = useCallback(
    (message: string) => {
      const id = Date.now();

      setToast({
        id,
        message,
      });

      window.setTimeout(() => {
        setToast((current) =>
          current?.id === id
            ? null
            : current
        );
      }, 2400);
    },
    []
  );

  // --------------------------------
  // ADD TO PLAN
  // --------------------------------

  const addToPlan = useCallback(
    (id: number) => {
      setPlan((current) => {
        const alreadyExists =
          current.some(
            (item) => item.id === id
          );

        if (alreadyExists) {
          showToast(
            "Already in today's plan"
          );

          return current;
        }

        if (current.length >= 5) {
          showToast(
            "Today's plan is capped at 5 lifts"
          );

          return current;
        }

        showToast(
          "Added to today's plan"
        );

        return [
          ...current,
          {
            id,
            done: false,
          },
        ];
      });
    },
    [showToast]
  );

  // --------------------------------
  // REMOVE FROM PLAN
  // --------------------------------

  const removeFromPlan = useCallback(
    (id: number) => {
      setPlan((current) =>
        current.filter(
          (item) => item.id !== id
        )
      );

      showToast(
        "Removed from today's plan"
      );
    },
    [showToast]
  );

  // --------------------------------
  // MARK WORKOUT AS DONE
  // --------------------------------

  const toggleDone = useCallback(
    (id: number) => {
      setPlan((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                done: true,
              }
            : item
        )
      );

      showToast(
        "Workout marked as done"
      );
    },
    [showToast]
  );

  // --------------------------------
  // SAVE WORKOUT
  // --------------------------------

  const saveWorkout = useCallback(
    (id: number) => {
      setSaved((current) => {
        if (current.includes(id)) {
          showToast("Already saved");

          return current;
        }

        showToast(
          "Saved for later"
        );

        return [
          ...current,
          id,
        ];
      });
    },
    [showToast]
  );

  // --------------------------------
  // REMOVE SAVED WORKOUT
  // --------------------------------

  const unsaveWorkout = useCallback(
    (id: number) => {
      setSaved((current) =>
        current.filter(
          (item) => item !== id
        )
      );

      showToast(
        "Removed from saved"
      );
    },
    [showToast]
  );

  // --------------------------------
  // CONTEXT VALUE
  // --------------------------------

  const value = useMemo<ContextValue>(
    () => ({
      workouts,
      loading,
      error,

      plan,
      saved,

      toast,

      addToPlan,
      removeFromPlan,
      toggleDone,

      saveWorkout,
      unsaveWorkout,

      isInPlan: (id: number) =>
        plan.some(
          (item) => item.id === id
        ),

      isSaved: (id: number) =>
        saved.includes(id),
    }),
    [
      workouts,
      loading,
      error,
      plan,
      saved,
      toast,

      addToPlan,
      removeFromPlan,
      toggleDone,

      saveWorkout,
      unsaveWorkout,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}

      <ToastView toast={toast} />
    </AppContext.Provider>
  );
}

// --------------------------------
// TOAST UI
// --------------------------------

function ToastView({
  toast,
}: {
  toast: Toast;
}) {
  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-full border border-[#C2F800]/30 bg-[#151515] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-2xl"
    >
      {toast.message}
    </div>
  );
}

// --------------------------------
// USE APP HOOK
// --------------------------------

export function useApp() {
  const value =
    useContext(AppContext);

  if (!value) {
    throw new Error(
      "useApp must be used inside AppProvider"
    );
  }

  return value;
}