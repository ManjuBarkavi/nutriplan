export type Nutrient = {
  id: string;
  name: string;
  icon: string;
  description: string;
  dailyGoal: string;
  color: string;
  foods: string[];
};

export const NUTRIENTS: Nutrient[] = [
  {
    id: "iron",
    name: "Iron",
    icon: "droplet",
    description: "Essential for red blood cells and oxygen transport",
    dailyGoal: "18mg",
    color: "#C0392B",
    foods: ["spinach", "lentils", "red meat", "tofu", "pumpkin seeds", "quinoa"],
  },
  {
    id: "zinc",
    name: "Zinc",
    icon: "zap",
    description: "Supports immune function and wound healing",
    dailyGoal: "11mg",
    color: "#2980B9",
    foods: ["oysters", "beef", "chickpeas", "cashews", "pumpkin seeds", "hemp seeds"],
  },
  {
    id: "vitaminD",
    name: "Vitamin D",
    icon: "sun",
    description: "Critical for bone health and immune support",
    dailyGoal: "600IU",
    color: "#F39C12",
    foods: ["salmon", "egg yolks", "fortified milk", "mushrooms", "tuna", "sardines"],
  },
  {
    id: "magnesium",
    name: "Magnesium",
    icon: "activity",
    description: "Supports muscle function and energy production",
    dailyGoal: "400mg",
    color: "#27AE60",
    foods: ["almonds", "dark chocolate", "avocado", "black beans", "whole grains", "bananas"],
  },
  {
    id: "omega3",
    name: "Omega-3",
    icon: "heart",
    description: "Reduces inflammation and supports heart health",
    dailyGoal: "1.6g",
    color: "#8E44AD",
    foods: ["salmon", "walnuts", "flaxseed", "chia seeds", "mackerel", "sardines"],
  },
  {
    id: "calcium",
    name: "Calcium",
    icon: "shield",
    description: "Essential for strong bones and teeth",
    dailyGoal: "1000mg",
    color: "#16A085",
    foods: ["dairy", "kale", "broccoli", "almonds", "fortified plant milk", "sardines"],
  },
  {
    id: "vitaminB12",
    name: "Vitamin B12",
    icon: "cpu",
    description: "Vital for nerve function and energy metabolism",
    dailyGoal: "2.4mcg",
    color: "#E74C3C",
    foods: ["beef", "clams", "nutritional yeast", "eggs", "fortified cereals", "salmon"],
  },
  {
    id: "vitaminC",
    name: "Vitamin C",
    icon: "cloud",
    description: "Boosts immunity and collagen production",
    dailyGoal: "90mg",
    color: "#E67E22",
    foods: ["bell peppers", "citrus fruits", "broccoli", "strawberries", "kiwi", "papaya"],
  },
];

export type MealType = "breakfast" | "lunch" | "dinner";
export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export type Meal = {
  id: string;
  name: string;
  type: MealType;
  day: DayOfWeek;
  nutrients: string[];
  benefits: string;
  ingredients: string[];
  calories: number;
  prepTime: string;
  consumed: boolean;
};

export type GroceryItem = {
  id: string;
  name: string;
  category: string;
  amount: string;
  checked: boolean;
};

export type JournalEntry = {
  id: string;
  date: string;
  energy: number;
  mood: number;
  notes: string;
  consumedMealIds: string[];
};

export type AppState = {
  selectedNutrients: string[];
  weeklyMeals: Meal[];
  groceryItems: GroceryItem[];
  journalEntries: JournalEntry[];
  weekStartDate: string;
};

const MEAL_DATABASE: Record<string, Meal[]> = {
  iron: [
    {
      id: "iron-1",
      name: "Spinach & Lentil Soup",
      type: "lunch",
      day: "Monday",
      nutrients: ["iron", "magnesium"],
      benefits: "Rich in non-heme iron, vitamin C boosts iron absorption",
      ingredients: ["red lentils", "fresh spinach", "tomatoes", "onion", "cumin", "lemon"],
      calories: 320,
      prepTime: "25 min",
      consumed: false,
    },
    {
      id: "iron-2",
      name: "Beef & Quinoa Bowl",
      type: "dinner",
      day: "Monday",
      nutrients: ["iron", "zinc"],
      benefits: "Heme iron from beef is highly bioavailable, quinoa adds plant-based iron",
      ingredients: ["lean beef", "quinoa", "roasted peppers", "arugula", "olive oil"],
      calories: 480,
      prepTime: "30 min",
      consumed: false,
    },
    {
      id: "iron-3",
      name: "Pumpkin Seed Oatmeal",
      type: "breakfast",
      day: "Tuesday",
      nutrients: ["iron", "magnesium"],
      benefits: "Pumpkin seeds are an excellent plant-based iron source",
      ingredients: ["rolled oats", "pumpkin seeds", "banana", "almond milk", "honey"],
      calories: 380,
      prepTime: "10 min",
      consumed: false,
    },
    {
      id: "iron-4",
      name: "Tofu & Bok Choy Stir Fry",
      type: "dinner",
      day: "Tuesday",
      nutrients: ["iron", "calcium"],
      benefits: "Firm tofu provides plant-based iron, bok choy adds vitamin C to enhance absorption",
      ingredients: ["firm tofu", "bok choy", "garlic", "ginger", "soy sauce", "sesame oil"],
      calories: 350,
      prepTime: "20 min",
      consumed: false,
    },
    {
      id: "iron-5",
      name: "Chickpea & Kale Salad",
      type: "lunch",
      day: "Wednesday",
      nutrients: ["iron", "calcium"],
      benefits: "Chickpeas are high in iron, kale provides vitamin C and calcium",
      ingredients: ["chickpeas", "kale", "lemon dressing", "cherry tomatoes", "tahini"],
      calories: 290,
      prepTime: "15 min",
      consumed: false,
    },
    {
      id: "iron-6",
      name: "Red Meat & Veggie Skewers",
      type: "dinner",
      day: "Wednesday",
      nutrients: ["iron", "zinc", "vitaminB12"],
      benefits: "Red meat provides highly bioavailable heme iron and B12",
      ingredients: ["sirloin steak", "bell peppers", "zucchini", "cherry tomatoes", "rosemary"],
      calories: 420,
      prepTime: "25 min",
      consumed: false,
    },
    {
      id: "iron-7",
      name: "Dark Chocolate Smoothie",
      type: "breakfast",
      day: "Thursday",
      nutrients: ["iron", "magnesium"],
      benefits: "Dark cacao is surprisingly rich in iron and magnesium",
      ingredients: ["cacao powder", "banana", "spinach", "almond milk", "dates"],
      calories: 310,
      prepTime: "5 min",
      consumed: false,
    },
  ],
  zinc: [
    {
      id: "zinc-1",
      name: "Cashew & Pumpkin Seed Granola",
      type: "breakfast",
      day: "Monday",
      nutrients: ["zinc", "magnesium"],
      benefits: "Cashews and pumpkin seeds are top plant sources of zinc",
      ingredients: ["rolled oats", "cashews", "pumpkin seeds", "honey", "coconut oil", "vanilla"],
      calories: 400,
      prepTime: "30 min",
      consumed: false,
    },
    {
      id: "zinc-2",
      name: "Beef Tacos with Hemp Seeds",
      type: "dinner",
      day: "Monday",
      nutrients: ["zinc", "iron"],
      benefits: "Beef provides zinc, hemp seeds add plant-based zinc and omega-3s",
      ingredients: ["ground beef", "corn tortillas", "hemp seeds", "avocado", "lime", "cilantro"],
      calories: 460,
      prepTime: "20 min",
      consumed: false,
    },
    {
      id: "zinc-3",
      name: "Chickpea Hummus Wrap",
      type: "lunch",
      day: "Tuesday",
      nutrients: ["zinc", "iron"],
      benefits: "Chickpeas are a great plant-based zinc source",
      ingredients: ["whole wheat wrap", "hummus", "chickpeas", "cucumber", "roasted peppers", "feta"],
      calories: 380,
      prepTime: "10 min",
      consumed: false,
    },
  ],
  vitaminD: [
    {
      id: "vitD-1",
      name: "Baked Salmon with Mushrooms",
      type: "dinner",
      day: "Monday",
      nutrients: ["vitaminD", "omega3"],
      benefits: "Salmon is one of the best dietary sources of vitamin D",
      ingredients: ["salmon fillet", "portobello mushrooms", "lemon", "dill", "olive oil", "garlic"],
      calories: 420,
      prepTime: "25 min",
      consumed: false,
    },
    {
      id: "vitD-2",
      name: "Sunny Egg & Fortified Milk Scramble",
      type: "breakfast",
      day: "Tuesday",
      nutrients: ["vitaminD", "vitaminB12"],
      benefits: "Egg yolks contain vitamin D, fortified milk doubles the dose",
      ingredients: ["eggs", "fortified whole milk", "chives", "whole grain toast", "butter"],
      calories: 350,
      prepTime: "10 min",
      consumed: false,
    },
    {
      id: "vitD-3",
      name: "Tuna Niçoise Salad",
      type: "lunch",
      day: "Wednesday",
      nutrients: ["vitaminD", "omega3"],
      benefits: "Tuna provides vitamin D, olives and egg add healthy fats",
      ingredients: ["canned tuna", "green beans", "boiled eggs", "olives", "tomatoes", "dijon"],
      calories: 370,
      prepTime: "20 min",
      consumed: false,
    },
  ],
  magnesium: [
    {
      id: "mag-1",
      name: "Almond & Dark Chocolate Overnight Oats",
      type: "breakfast",
      day: "Monday",
      nutrients: ["magnesium", "iron"],
      benefits: "Almonds and dark chocolate are magnesium powerhouses",
      ingredients: ["oats", "almond milk", "almonds", "dark chocolate chips", "chia seeds", "maple syrup"],
      calories: 420,
      prepTime: "5 min (overnight)",
      consumed: false,
    },
    {
      id: "mag-2",
      name: "Avocado & Black Bean Bowl",
      type: "lunch",
      day: "Tuesday",
      nutrients: ["magnesium", "iron"],
      benefits: "Black beans and avocado are rich in magnesium",
      ingredients: ["black beans", "avocado", "brown rice", "corn", "lime", "cilantro", "cumin"],
      calories: 450,
      prepTime: "15 min",
      consumed: false,
    },
  ],
  omega3: [
    {
      id: "omega-1",
      name: "Chia Seed Pudding",
      type: "breakfast",
      day: "Monday",
      nutrients: ["omega3", "calcium"],
      benefits: "Chia seeds are one of the richest plant sources of omega-3 fatty acids",
      ingredients: ["chia seeds", "coconut milk", "mango", "kiwi", "honey", "vanilla"],
      calories: 330,
      prepTime: "5 min (overnight)",
      consumed: false,
    },
    {
      id: "omega-2",
      name: "Walnut & Flaxseed Smoothie Bowl",
      type: "breakfast",
      day: "Wednesday",
      nutrients: ["omega3", "magnesium"],
      benefits: "Walnuts and flaxseed provide plant-based ALA omega-3s",
      ingredients: ["frozen banana", "walnuts", "ground flaxseed", "almond milk", "berries"],
      calories: 380,
      prepTime: "8 min",
      consumed: false,
    },
  ],
  calcium: [
    {
      id: "cal-1",
      name: "Kale & Almond Caesar Salad",
      type: "lunch",
      day: "Monday",
      nutrients: ["calcium", "vitaminC"],
      benefits: "Kale contains more calcium than milk per calorie",
      ingredients: ["kale", "almonds", "parmesan", "caesar dressing", "whole grain croutons"],
      calories: 320,
      prepTime: "10 min",
      consumed: false,
    },
    {
      id: "cal-2",
      name: "Yogurt Parfait with Sardines Toast",
      type: "breakfast",
      day: "Tuesday",
      nutrients: ["calcium", "omega3", "vitaminD"],
      benefits: "Greek yogurt and sardines are calcium superfoods",
      ingredients: ["greek yogurt", "sardines", "whole grain bread", "cucumber", "berries", "granola"],
      calories: 450,
      prepTime: "5 min",
      consumed: false,
    },
  ],
  vitaminB12: [
    {
      id: "b12-1",
      name: "Beef & Nutritional Yeast Pasta",
      type: "dinner",
      day: "Monday",
      nutrients: ["vitaminB12", "iron", "zinc"],
      benefits: "Beef is the richest source of B12, nutritional yeast adds B-vitamins",
      ingredients: ["lean ground beef", "whole wheat pasta", "nutritional yeast", "garlic", "spinach"],
      calories: 520,
      prepTime: "25 min",
      consumed: false,
    },
    {
      id: "b12-2",
      name: "Clam Chowder",
      type: "lunch",
      day: "Wednesday",
      nutrients: ["vitaminB12", "iron"],
      benefits: "Clams have the highest B12 content of any food",
      ingredients: ["clams", "potato", "cream", "bacon", "onion", "thyme", "whole grain bread"],
      calories: 480,
      prepTime: "35 min",
      consumed: false,
    },
  ],
  vitaminC: [
    {
      id: "vitC-1",
      name: "Bell Pepper & Citrus Smoothie",
      type: "breakfast",
      day: "Monday",
      nutrients: ["vitaminC", "iron"],
      benefits: "Bell peppers have more vitamin C than oranges, citrus amplifies iron absorption",
      ingredients: ["red bell pepper", "orange", "grapefruit", "ginger", "turmeric", "water"],
      calories: 180,
      prepTime: "5 min",
      consumed: false,
    },
    {
      id: "vitC-2",
      name: "Strawberry Kiwi Broccoli Salad",
      type: "lunch",
      day: "Tuesday",
      nutrients: ["vitaminC", "calcium"],
      benefits: "Triple vitamin C punch from strawberries, kiwi, and broccoli",
      ingredients: ["strawberries", "kiwi", "broccoli florets", "almonds", "poppy seed dressing"],
      calories: 270,
      prepTime: "10 min",
      consumed: false,
    },
  ],
};

const BASE_MEALS: Meal[] = [
  {
    id: "base-1",
    name: "Greek Yogurt with Berries",
    type: "breakfast",
    day: "Monday",
    nutrients: ["calcium", "vitaminC"],
    benefits: "Probiotic-rich start to the day with antioxidants from mixed berries",
    ingredients: ["greek yogurt", "mixed berries", "honey", "granola", "mint"],
    calories: 280,
    prepTime: "5 min",
    consumed: false,
  },
  {
    id: "base-2",
    name: "Mediterranean Grain Bowl",
    type: "lunch",
    day: "Monday",
    nutrients: ["iron", "magnesium"],
    benefits: "Balanced macros with whole grains, healthy fats, and plant protein",
    ingredients: ["farro", "roasted chickpeas", "cucumber", "feta", "olives", "za'atar"],
    calories: 420,
    prepTime: "20 min",
    consumed: false,
  },
  {
    id: "base-3",
    name: "Avocado Toast with Poached Egg",
    type: "breakfast",
    day: "Tuesday",
    nutrients: ["omega3", "vitaminD"],
    benefits: "Healthy fats from avocado support brain health and hormone production",
    ingredients: ["sourdough bread", "avocado", "eggs", "red pepper flakes", "lemon", "microgreens"],
    calories: 380,
    prepTime: "15 min",
    consumed: false,
  },
  {
    id: "base-4",
    name: "Chicken & Vegetable Soup",
    type: "dinner",
    day: "Tuesday",
    nutrients: ["zinc", "vitaminC"],
    benefits: "Collagen from bone broth supports gut health and skin",
    ingredients: ["chicken breast", "carrots", "celery", "zucchini", "bay leaves", "whole grain bread"],
    calories: 350,
    prepTime: "40 min",
    consumed: false,
  },
  {
    id: "base-5",
    name: "Banana Oat Pancakes",
    type: "breakfast",
    day: "Wednesday",
    nutrients: ["magnesium", "vitaminB12"],
    benefits: "Naturally sweetened with banana, provides sustained energy",
    ingredients: ["oats", "banana", "eggs", "almond milk", "cinnamon", "maple syrup"],
    calories: 340,
    prepTime: "20 min",
    consumed: false,
  },
  {
    id: "base-6",
    name: "Roasted Vegetable Buddha Bowl",
    type: "lunch",
    day: "Wednesday",
    nutrients: ["vitaminC", "iron"],
    benefits: "Rainbow of vegetables provides diverse antioxidants and micronutrients",
    ingredients: ["sweet potato", "broccoli", "beets", "tahini", "quinoa", "hemp seeds"],
    calories: 390,
    prepTime: "35 min",
    consumed: false,
  },
  {
    id: "base-7",
    name: "Stuffed Bell Peppers",
    type: "dinner",
    day: "Wednesday",
    nutrients: ["vitaminC", "zinc"],
    benefits: "Vitamin C from peppers enhances mineral absorption from turkey filling",
    ingredients: ["bell peppers", "ground turkey", "brown rice", "tomatoes", "mozzarella", "basil"],
    calories: 440,
    prepTime: "40 min",
    consumed: false,
  },
  {
    id: "base-8",
    name: "Smoothie Bowl",
    type: "breakfast",
    day: "Thursday",
    nutrients: ["vitaminC", "omega3"],
    benefits: "Antioxidant-rich berries with omega-3 from hemp and flax seeds",
    ingredients: ["acai", "frozen berries", "banana", "hemp seeds", "flaxseed", "coconut"],
    calories: 360,
    prepTime: "10 min",
    consumed: false,
  },
  {
    id: "base-9",
    name: "Lemon Herb Salmon",
    type: "dinner",
    day: "Thursday",
    nutrients: ["omega3", "vitaminD", "vitaminB12"],
    benefits: "Wild salmon is nature's multivitamin for brain and heart health",
    ingredients: ["wild salmon", "asparagus", "lemon", "dill", "capers", "olive oil"],
    calories: 450,
    prepTime: "25 min",
    consumed: false,
  },
  {
    id: "base-10",
    name: "Overnight Oats",
    type: "breakfast",
    day: "Friday",
    nutrients: ["magnesium", "iron"],
    benefits: "Slow-release carbs for sustained morning energy and fiber for gut health",
    ingredients: ["rolled oats", "chia seeds", "almond milk", "banana", "peanut butter", "berries"],
    calories: 400,
    prepTime: "5 min (overnight)",
    consumed: false,
  },
  {
    id: "base-11",
    name: "Turkey & Avocado Wrap",
    type: "lunch",
    day: "Thursday",
    nutrients: ["zinc", "omega3"],
    benefits: "Lean protein supports muscle recovery and immune function",
    ingredients: ["whole wheat wrap", "turkey breast", "avocado", "spinach", "mustard", "tomato"],
    calories: 420,
    prepTime: "10 min",
    consumed: false,
  },
  {
    id: "base-12",
    name: "Shrimp Stir Fry",
    type: "dinner",
    day: "Friday",
    nutrients: ["zinc", "vitaminB12"],
    benefits: "Shrimp provides lean protein, zinc, and iodine for thyroid health",
    ingredients: ["shrimp", "bok choy", "snap peas", "ginger", "garlic", "sesame", "brown rice"],
    calories: 390,
    prepTime: "20 min",
    consumed: false,
  },
  {
    id: "base-13",
    name: "Veggie Omelette",
    type: "breakfast",
    day: "Saturday",
    nutrients: ["vitaminD", "vitaminB12"],
    benefits: "Eggs are one of few foods with naturally occurring vitamin D",
    ingredients: ["eggs", "spinach", "mushrooms", "feta", "cherry tomatoes", "herbs"],
    calories: 320,
    prepTime: "15 min",
    consumed: false,
  },
  {
    id: "base-14",
    name: "Grilled Chicken Caesar",
    type: "lunch",
    day: "Friday",
    nutrients: ["calcium", "vitaminC"],
    benefits: "Romaine is high in vitamin K for bone health alongside calcium from parmesan",
    ingredients: ["chicken breast", "romaine", "parmesan", "caesar dressing", "whole grain croutons"],
    calories: 380,
    prepTime: "20 min",
    consumed: false,
  },
  {
    id: "base-15",
    name: "Lamb & Root Vegetable Stew",
    type: "dinner",
    day: "Saturday",
    nutrients: ["iron", "zinc", "vitaminB12"],
    benefits: "Red meat provides heme iron, zinc, and B12 in highly bioavailable forms",
    ingredients: ["lamb shoulder", "parsnips", "carrots", "rosemary", "red wine", "bone broth"],
    calories: 520,
    prepTime: "60 min",
    consumed: false,
  },
  {
    id: "base-16",
    name: "Açaí Power Bowl",
    type: "breakfast",
    day: "Sunday",
    nutrients: ["omega3", "vitaminC"],
    benefits: "Açaí berries are among the highest antioxidant foods, perfect weekly reset",
    ingredients: ["açaí packet", "banana", "granola", "kiwi", "mango", "coconut flakes", "honey"],
    calories: 420,
    prepTime: "10 min",
    consumed: false,
  },
  {
    id: "base-17",
    name: "Sushi Bowl",
    type: "lunch",
    day: "Saturday",
    nutrients: ["omega3", "vitaminD"],
    benefits: "Raw fish preserves all omega-3 fatty acids, seaweed adds iodine",
    ingredients: ["sushi rice", "salmon", "avocado", "cucumber", "nori", "soy sauce", "sesame"],
    calories: 460,
    prepTime: "20 min",
    consumed: false,
  },
  {
    id: "base-18",
    name: "Mediterranean Platter",
    type: "lunch",
    day: "Sunday",
    nutrients: ["calcium", "iron", "vitaminC"],
    benefits: "Diverse Mediterranean foods offer a broad micronutrient spectrum",
    ingredients: ["hummus", "pita", "olives", "feta", "tomatoes", "cucumber", "grapes"],
    calories: 450,
    prepTime: "10 min",
    consumed: false,
  },
  {
    id: "base-19",
    name: "Roast Chicken with Sweet Potato",
    type: "dinner",
    day: "Sunday",
    nutrients: ["vitaminB12", "vitaminC", "magnesium"],
    benefits: "Sweet potato provides beta-carotene, chicken offers complete protein and B vitamins",
    ingredients: ["whole chicken", "sweet potato", "brussels sprouts", "garlic", "thyme", "lemon"],
    calories: 550,
    prepTime: "75 min",
    consumed: false,
  },
];

export function generateWeeklyMeals(selectedNutrients: string[]): Meal[] {
  const meals: Meal[] = [...BASE_MEALS];

  const usedIds = new Set(meals.map((m) => m.id));

  for (const nutrientId of selectedNutrients) {
    const nutrientMeals = MEAL_DATABASE[nutrientId] || [];
    for (const meal of nutrientMeals) {
      if (!usedIds.has(meal.id)) {
        usedIds.add(meal.id);
        meals.push({ ...meal, consumed: false });
      }
    }
  }

  return meals;
}

export function generateGroceryList(meals: Meal[]): GroceryItem[] {
  const ingredientMap: Map<string, { count: number; category: string }> =
    new Map();

  const categorize = (ingredient: string): string => {
    const proteins = [
      "beef",
      "chicken",
      "salmon",
      "tuna",
      "shrimp",
      "lamb",
      "turkey",
      "tofu",
      "eggs",
      "clams",
    ];
    const produce = [
      "spinach",
      "kale",
      "avocado",
      "tomato",
      "cucumber",
      "lemon",
      "banana",
      "berries",
      "bell pepper",
      "broccoli",
      "mushroom",
      "mango",
      "kiwi",
      "orange",
      "grapefruit",
      "asparagus",
      "sweet potato",
      "bok choy",
      "zucchini",
    ];
    const dairy = [
      "milk",
      "yogurt",
      "cheese",
      "feta",
      "butter",
      "cream",
      "mozzarella",
      "parmesan",
    ];
    const grains = [
      "oats",
      "rice",
      "quinoa",
      "bread",
      "pasta",
      "wrap",
      "tortilla",
      "pita",
      "crouton",
      "farro",
    ];
    const nuts = [
      "almond",
      "cashew",
      "walnut",
      "pumpkin seed",
      "hemp seed",
      "chia",
      "flaxseed",
      "granola",
    ];
    const pantry = [
      "olive oil",
      "soy sauce",
      "honey",
      "maple syrup",
      "spice",
      "herb",
      "garlic",
      "onion",
      "ginger",
      "cumin",
      "salt",
      "pepper",
    ];

    const lowerIng = ingredient.toLowerCase();
    if (proteins.some((p) => lowerIng.includes(p))) return "Proteins";
    if (produce.some((p) => lowerIng.includes(p))) return "Produce";
    if (dairy.some((d) => lowerIng.includes(d))) return "Dairy";
    if (grains.some((g) => lowerIng.includes(g))) return "Grains";
    if (nuts.some((n) => lowerIng.includes(n))) return "Nuts & Seeds";
    if (pantry.some((p) => lowerIng.includes(p))) return "Pantry";
    return "Other";
  };

  for (const meal of meals) {
    for (const ingredient of meal.ingredients) {
      const existing = ingredientMap.get(ingredient);
      if (existing) {
        existing.count += 1;
      } else {
        ingredientMap.set(ingredient, {
          count: 1,
          category: categorize(ingredient),
        });
      }
    }
  }

  const items: GroceryItem[] = [];
  let idx = 0;
  for (const [name, { count, category }] of ingredientMap.entries()) {
    items.push({
      id: `grocery-${idx++}`,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      category,
      amount: count > 1 ? `×${count}` : "",
      checked: false,
    });
  }

  return items.sort((a, b) => a.category.localeCompare(b.category));
}
