import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

const STORAGE_KEY = "@nutriplan_app_state";

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

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) {
          setState(JSON.parse(stored));
        }
      })
      .finally(() => setIsLoading(false));
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
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
