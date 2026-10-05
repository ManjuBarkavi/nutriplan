import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AppState,
  GroceryItem,
  JournalEntry,
  Meal,
  generateGroceryList,
  generateWeeklyMeals,
} from "@/constants/nutrients";
import {
  SYNC_AVAILABLE,
  generateSyncCode,
  isValidSyncCode,
  pullState,
  pushState,
} from "@/lib/sync";

const STORAGE_KEY = "@nutriplan_app_state";
const SYNC_CODE_KEY = "@nutriplan_sync_code";
const LAST_SYNC_KEY = "@nutriplan_last_sync";

export type SyncStatus = "idle" | "syncing" | "error";

type CustomMealInput = {
  name: string;
  type: string;
  day: string;
  ingredients: string[];
  benefits: string;
  calories: number;
  prepTime: string;
  nutrients: string[];
};

interface AppContextValue {
  state: AppState;
  isLoading: boolean;
  selectNutrient: (id: string) => void;
  deselectNutrient: (id: string) => void;
  generatePlan: () => void;
  toggleMealConsumed: (mealId: string) => void;
  toggleGroceryItem: (itemId: string) => void;
  addJournalEntry: (entry: Omit<JournalEntry, "id">) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  getTodayEntry: () => JournalEntry | undefined;
  getMealsByDay: (day: string) => Meal[];
  getGroceryByCategory: () => Record<string, GroceryItem[]>;
  getNutrientProgress: (nutrientId: string) => number;
  resetPlan: () => void;
  addCustomMeal: (input: CustomMealInput) => void;
  syncAvailable: boolean;
  syncCode: string | null;
  syncStatus: SyncStatus;
  enableSync: () => Promise<void>;
  joinSync: (code: string) => Promise<"ok" | "invalid" | "not-found" | "error">;
  disableSync: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const getWeekStart = (): string => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split("T")[0];
};

const defaultState: AppState = {
  selectedNutrients: [],
  weeklyMeals: [],
  groceryItems: [],
  journalEntries: [],
  weekStartDate: getWeekStart(),
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [isLoading, setIsLoading] = useState(true);

  const [syncCode, setSyncCode] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [reconciled, setReconciled] = useState(false);
  const skipNextPush = useRef(false);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(STORAGE_KEY),
      SYNC_AVAILABLE ? AsyncStorage.getItem(SYNC_CODE_KEY) : null,
    ])
      .then(([stored, code]) => {
        if (stored) {
          setState(JSON.parse(stored));
        }
        if (code) setSyncCode(code);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // On startup, adopt the server copy if another device changed it since this device last synced.
  useEffect(() => {
    if (isLoading || !syncCode) {
      setReconciled(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setSyncStatus("syncing");
      try {
        const [remote, lastSync] = await Promise.all([
          pullState(syncCode),
          AsyncStorage.getItem(LAST_SYNC_KEY),
        ]);
        if (cancelled) return;
        skipNextPush.current = true;
        if (remote && remote.updatedAt !== lastSync) {
          setState({ ...defaultState, ...remote.state });
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remote.state));
          await AsyncStorage.setItem(LAST_SYNC_KEY, remote.updatedAt);
        }
        setSyncStatus("idle");
      } catch {
        if (!cancelled) setSyncStatus("error");
      }
      if (!cancelled) setReconciled(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoading, syncCode]);

  // Push local changes shortly after they stop (last write wins on the server).
  useEffect(() => {
    if (!syncCode || !reconciled) return;
    if (skipNextPush.current) {
      skipNextPush.current = false;
      return;
    }
    const timer = setTimeout(async () => {
      setSyncStatus("syncing");
      try {
        const updatedAt = await pushState(syncCode, state);
        await AsyncStorage.setItem(LAST_SYNC_KEY, updatedAt);
        setSyncStatus("idle");
      } catch {
        setSyncStatus("error");
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [state, syncCode, reconciled]);

  const enableSync = useCallback(async () => {
    const code = generateSyncCode();
    setSyncStatus("syncing");
    try {
      const updatedAt = await pushState(code, state);
      await AsyncStorage.multiSet([
        [SYNC_CODE_KEY, code],
        [LAST_SYNC_KEY, updatedAt],
      ]);
      skipNextPush.current = true;
      setSyncCode(code);
      setSyncStatus("idle");
    } catch {
      setSyncStatus("error");
    }
  }, [state]);

  const joinSync = useCallback(async (raw: string) => {
    const code = raw.trim().toLowerCase();
    if (!isValidSyncCode(code)) return "invalid" as const;
    setSyncStatus("syncing");
    try {
      const remote = await pullState(code);
      if (!remote) {
        setSyncStatus("idle");
        return "not-found" as const;
      }
      const next = { ...defaultState, ...remote.state };
      await AsyncStorage.multiSet([
        [STORAGE_KEY, JSON.stringify(next)],
        [SYNC_CODE_KEY, code],
        [LAST_SYNC_KEY, remote.updatedAt],
      ]);
      skipNextPush.current = true;
      setState(next);
      setSyncCode(code);
      setSyncStatus("idle");
      return "ok" as const;
    } catch {
      setSyncStatus("error");
      return "error" as const;
    }
  }, []);

  const disableSync = useCallback(() => {
    AsyncStorage.multiRemove([SYNC_CODE_KEY, LAST_SYNC_KEY]);
    setSyncCode(null);
    setSyncStatus("idle");
  }, []);

  const persist = useCallback((newState: AppState) => {
    setState(newState);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

  const selectNutrient = useCallback(
    (id: string) => {
      if (state.selectedNutrients.includes(id)) return;
      persist({
        ...state,
        selectedNutrients: [...state.selectedNutrients, id],
      });
    },
    [state, persist]
  );

  const deselectNutrient = useCallback(
    (id: string) => {
      persist({
        ...state,
        selectedNutrients: state.selectedNutrients.filter((n) => n !== id),
      });
    },
    [state, persist]
  );

  const generatePlan = useCallback(() => {
    const meals = generateWeeklyMeals(state.selectedNutrients);
    const groceryItems = generateGroceryList(meals);
    persist({
      ...state,
      weeklyMeals: meals,
      groceryItems,
      weekStartDate: getWeekStart(),
    });
  }, [state, persist]);

  const toggleMealConsumed = useCallback(
    (mealId: string) => {
      const meals = state.weeklyMeals.map((m) =>
        m.id === mealId ? { ...m, consumed: !m.consumed } : m
      );
      persist({ ...state, weeklyMeals: meals });
    },
    [state, persist]
  );

  const toggleGroceryItem = useCallback(
    (itemId: string) => {
      const groceryItems = state.groceryItems.map((g) =>
        g.id === itemId ? { ...g, checked: !g.checked } : g
      );
      persist({ ...state, groceryItems });
    },
    [state, persist]
  );

  const addJournalEntry = useCallback(
    (entry: Omit<JournalEntry, "id">) => {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const newEntry: JournalEntry = { ...entry, id };
      persist({
        ...state,
        journalEntries: [...state.journalEntries, newEntry],
      });
    },
    [state, persist]
  );

  const updateJournalEntry = useCallback(
    (id: string, updates: Partial<JournalEntry>) => {
      const journalEntries = state.journalEntries.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      );
      persist({ ...state, journalEntries });
    },
    [state, persist]
  );

  const getTodayEntry = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    return state.journalEntries.find((e) => e.date === today);
  }, [state.journalEntries]);

  const getMealsByDay = useCallback(
    (day: string) => {
      return state.weeklyMeals.filter((m) => m.day === day);
    },
    [state.weeklyMeals]
  );

  const getGroceryByCategory = useCallback(() => {
    const map: Record<string, GroceryItem[]> = {};
    for (const item of state.groceryItems) {
      if (!map[item.category]) map[item.category] = [];
      map[item.category].push(item);
    }
    return map;
  }, [state.groceryItems]);

  const getNutrientProgress = useCallback(
    (nutrientId: string) => {
      const today = new Date().toLocaleString("en-US", { weekday: "long" });
      const todayMeals = state.weeklyMeals.filter(
        (m) => m.day === today && m.nutrients.includes(nutrientId)
      );
      if (todayMeals.length === 0) return 0;
      const consumed = todayMeals.filter((m) => m.consumed).length;
      return consumed / todayMeals.length;
    },
    [state.weeklyMeals]
  );

  const resetPlan = useCallback(() => {
    persist({ ...defaultState, weekStartDate: getWeekStart() });
  }, [persist]);

  const addCustomMeal = useCallback(
    (input: CustomMealInput) => {
      const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const newMeal: Meal = {
        id,
        name: input.name,
        type: input.type as any,
        day: input.day as any,
        nutrients: input.nutrients,
        ingredients: input.ingredients,
        benefits: input.benefits,
        calories: input.calories,
        prepTime: input.prepTime,
        consumed: false,
      };
      const newGroceryItems = input.ingredients.map((ing, idx) => ({
        id: `${id}_ing_${idx}`,
        name: ing,
        category: "Custom",
        checked: false,
        mealIds: [id],
      }));
      const existingGrocery = state.groceryItems.filter(
        (g) => g.category !== "Custom" || !g.mealIds?.includes(id)
      );
      persist({
        ...state,
        weeklyMeals: [...state.weeklyMeals, newMeal],
        groceryItems: [...existingGrocery, ...newGroceryItems],
      });
    },
    [state, persist]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      isLoading,
      selectNutrient,
      deselectNutrient,
      generatePlan,
      toggleMealConsumed,
      toggleGroceryItem,
      addJournalEntry,
      updateJournalEntry,
      getTodayEntry,
      getMealsByDay,
      getGroceryByCategory,
      getNutrientProgress,
      resetPlan,
      addCustomMeal,
      syncAvailable: SYNC_AVAILABLE,
      syncCode,
      syncStatus,
      enableSync,
      joinSync,
      disableSync,
    }),
    [
      state,
      isLoading,
      selectNutrient,
      deselectNutrient,
      generatePlan,
      toggleMealConsumed,
      toggleGroceryItem,
      addJournalEntry,
      updateJournalEntry,
      getTodayEntry,
      getMealsByDay,
      getGroceryByCategory,
      getNutrientProgress,
      resetPlan,
      addCustomMeal,
      syncCode,
      syncStatus,
      enableSync,
      joinSync,
      disableSync,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
