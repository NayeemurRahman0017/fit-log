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

const API_URL = "https://api.abcz.workers.dev/api/fitlog";

const PLAN_KEY = "fitlog-plan-v1";
const SAVED_KEY = "fitlog-saved-v1";

type Toast = {
  id: number;
  message: string;
} | null;

type ContextValue = {
  workouts: Workout[];
  loading: boolean;

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

const AppContext = createContext<ContextValue | null>(null);

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const [plan, setPlan] = useState<PlanItem[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const rawPlan = localStorage.getItem(PLAN_KEY);
      return rawPlan ? JSON.parse(rawPlan) : [];
    } catch {
      return [];
    }
  });
  const [saved, setSaved] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const rawSaved = localStorage.getItem(SAVED_KEY);
      return rawSaved ? JSON.parse(rawSaved) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState<Toast>(null);

  /*
   * Persist plan
   */
  useEffect(() => {
    localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  }, [plan]);

  /*
   * Persist saved
   */
  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  }, [saved]);

  /*
   * Fetch workouts
   */
  useEffect(() => {
    const controller = new AbortController();

    async function fetchWorkouts() {
      try {
        setLoading(true);

        const response = await fetch(API_URL, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load workouts");
        }

        const data: Workout[] = await response.json();

        setWorkouts(data);
      } catch (error) {
        if ((error as Error)?.name !== "AbortError") {
          setWorkouts([]);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchWorkouts();

    return () => {
      controller.abort();
    };
  }, []);

  /*
   * Toast
   */
  const showToast = useCallback((message: string) => {
    const id = Date.now();

    setToast({
      id,
      message,
    });

    window.setTimeout(() => {
      setToast((current) =>
        current?.id === id ? null : current
      );
    }, 2400);
  }, []);

  /*
   * Add to today's plan
   */
  const addToPlan = useCallback(
    (id: number) => {
      setPlan((current) => {
        if (current.some((item) => item.id === id)) {
          showToast("Already in today's plan");
          return current;
        }

        if (current.length >= 5) {
          showToast("Today's plan is capped at 5 lifts");
          return current;
        }

        showToast("Added to today's plan");

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

  /*
   * Remove from plan
   */
  const removeFromPlan = useCallback(
    (id: number) => {
      setPlan((current) =>
        current.filter((item) => item.id !== id)
      );

      showToast("Removed from today's plan");
    },
    [showToast]
  );

  /*
   * Mark as done
   */
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

      showToast("Workout marked as done");
    },
    [showToast]
  );

  /*
   * Save
   */
  const saveWorkout = useCallback(
    (id: number) => {
      setSaved((current) => {
        if (current.includes(id)) {
          showToast("Already saved");
          return current;
        }

        showToast("Saved for later");

        return [...current, id];
      });
    },
    [showToast]
  );

  /*
   * Unsave
   */
  const unsaveWorkout = useCallback(
    (id: number) => {
      setSaved((current) =>
        current.filter((item) => item !== id)
      );

      showToast("Removed from saved");
    },
    [showToast]
  );

  const value = useMemo<ContextValue>(
    () => ({
      workouts,
      loading,

      plan,
      saved,

      toast,

      addToPlan,
      removeFromPlan,
      toggleDone,

      saveWorkout,
      unsaveWorkout,

      isInPlan: (id) =>
        plan.some((item) => item.id === id),

      isSaved: (id) =>
        saved.includes(id),
    }),
    [
      workouts,
      loading,
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

function ToastView({
  toast,
}: {
  toast: Toast;
}) {
  if (!toast) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-acid/30 bg-[#151515] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-2xl">
      {toast.message}
    </div>
  );
}

export function useApp() {
  const value = useContext(AppContext);

  if (!value) {
    throw new Error(
      "useApp must be used inside AppProvider"
    );
  }

  return value;
}