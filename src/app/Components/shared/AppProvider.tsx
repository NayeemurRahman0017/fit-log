"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Workout, PlanItem } from "../../../types";

const API_URL =
  "https://api.abcz.workers.dev/api/fitlog";

const PLAN_STORAGE_KEY = "fitlog-plan-v1";
const SAVED_STORAGE_KEY = "fitlog-saved-v1";

type AppContextType = {
  workouts: Workout[];
  loading: boolean;

  plan: PlanItem[];
  saved: number[];

  toast: string | null;

  addToPlan: (id: number) => void;
  removeFromPlan: (id: number) => void;
  toggleDone: (id: number) => void;

  saveWorkout: (id: number) => void;
  unsaveWorkout: (id: number) => void;

  isInPlan: (id: number) => boolean;
  isSaved: (id: number) => boolean;
};

const AppContext = createContext<
  AppContextType | undefined
>(undefined);

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [workouts, setWorkouts] = useState<Workout[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  const [plan, setPlan] = useState<PlanItem[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const savedPlan = window.localStorage.getItem(
        PLAN_STORAGE_KEY
      );
      return savedPlan ? JSON.parse(savedPlan) : [];
    } catch (error) {
      console.error("LocalStorage loading error:", error);
      return [];
    }
  });

  const [saved, setSaved] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const savedWorkouts = window.localStorage.getItem(
        SAVED_STORAGE_KEY
      );
      return savedWorkouts ? JSON.parse(savedWorkouts) : [];
    } catch (error) {
      console.error("LocalStorage loading error:", error);
      return [];
    }
  });

  const [toast, setToast] = useState<string | null>(
    null
  );

  

  const showToast = (message: string) => {
    setToast(message);

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

 

  useEffect(() => {
    const controller = new AbortController();

    async function loadWorkouts() {
      try {
        setLoading(true);

        const response = await fetch(API_URL, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Workout API error: ${response.status}`
          );
        }

        const data: Workout[] =
          await response.json();

        setWorkouts(data);
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Workout loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadWorkouts();

    return () => {
      controller.abort();
    };
  }, []);

  

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(
        PLAN_STORAGE_KEY,
        JSON.stringify(plan)
      );
    }
  }, [plan, loading]);

  

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(
        SAVED_STORAGE_KEY,
        JSON.stringify(saved)
      );
    }
  }, [saved, loading]);

 

  const addToPlan = (id: number) => {
    setPlan((currentPlan) => {
      const alreadyExists = currentPlan.some(
        (item) => item.id === id
      );

      if (alreadyExists) {
        showToast(
          "Workout is already in today's plan."
        );

        return currentPlan;
      }

      if (currentPlan.length >= 5) {
        showToast(
          "You can add maximum 5 workouts to your plan."
        );

        return currentPlan;
      }

      showToast(
        "Workout added to today's plan."
      );

      return [
        ...currentPlan,
        {
          id,
          done: false,
        },
      ];
    });
  };

 

  const removeFromPlan = (id: number) => {
    setPlan((currentPlan) => {
      const workout = workouts.find(
        (item) => item.id === id
      );

      const updatedPlan = currentPlan.filter(
        (item) => item.id !== id
      );

      if (updatedPlan.length !== currentPlan.length) {
        showToast(
          `${workout?.name ?? "Workout"} removed from your plan.`
        );
      }

      return updatedPlan;
    });
  };

  
  const toggleDone = (id: number) => {
    setPlan((currentPlan) => {
      const workout = workouts.find(
        (item) => item.id === id
      );

      return currentPlan.map((item) => {
        if (item.id !== id) {
          return item;
        }

        
        if (item.done) {
          showToast(
            `${workout?.name ?? "Workout"} is already completed.`
          );

          return item;
        }

        showToast(
          `${workout?.name ?? "Workout"} marked as done!`
        );

        return {
          ...item,
          done: true,
        };
      });
    });
  };

  

  const saveWorkout = (id: number) => {
    setSaved((currentSaved) => {
      if (currentSaved.includes(id)) {
        return currentSaved;
      }

      showToast("Workout saved for later.");

      return [...currentSaved, id];
    });
  };

 
  const unsaveWorkout = (id: number) => {
    setSaved((currentSaved) => {
      const updated = currentSaved.filter(
        (item) => item !== id
      );

      if (updated.length !== currentSaved.length) {
        showToast("Workout removed from saved.");
      }

      return updated;
    });
  };

  
  const isInPlan = (id: number) => {
    return plan.some(
      (item) => item.id === id
    );
  };

  const isSaved = (id: number) => {
    return saved.includes(id);
  };

  return (
    <AppContext.Provider
      value={{
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

        isInPlan,
        isSaved,
      }}
    >
      {children}

     

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-9999 -translate-x-1/2 px-4">
          <div className="flex items-center gap-3 rounded-xl border border-[#ccff00]/40 bg-[#151515] px-5 py-3 shadow-2xl">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ccff00] text-black">
              ✓
            </div>

            <p className="whitespace-nowrap text-sm font-bold text-white">
              {toast}
            </p>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
}



export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used inside AppProvider"
    );
  }

  return context;
}