const FOOD_IMAGES = {
  breakfast: require("@/assets/images/food-breakfast.png"),
  lunchBowl: require("@/assets/images/food-lunch-bowl.png"),
  salmon: require("@/assets/images/food-salmon.png"),
  soup: require("@/assets/images/food-soup.png"),
  smoothie: require("@/assets/images/food-smoothie.png"),
  salad: require("@/assets/images/food-salad.png"),
  stirfry: require("@/assets/images/food-stirfry.png"),
  dinner: require("@/assets/images/food-dinner.png"),
};

export type FoodImageKey = keyof typeof FOOD_IMAGES;

export function getMealImage(mealName: string, mealType: string) {
  const name = mealName.toLowerCase();

  if (
    name.includes("smoothie") ||
    name.includes("açaí") ||
    name.includes("acai")
  )
    return FOOD_IMAGES.smoothie;

  if (
    name.includes("oat") ||
    name.includes("pancake") ||
    name.includes("granola") ||
    name.includes("yogurt") ||
    name.includes("egg") ||
    name.includes("omelette") ||
    name.includes("toast") ||
    name.includes("pudding") ||
    mealType === "breakfast"
  )
    return FOOD_IMAGES.breakfast;

  if (
    name.includes("salmon") ||
    name.includes("tuna") ||
    name.includes("sardine") ||
    name.includes("sushi") ||
    name.includes("fish")
  )
    return FOOD_IMAGES.salmon;

  if (
    name.includes("soup") ||
    name.includes("stew") ||
    name.includes("chowder")
  )
    return FOOD_IMAGES.soup;

  if (
    name.includes("salad") ||
    name.includes("caesar") ||
    name.includes("niçoise") ||
    name.includes("nicoise")
  )
    return FOOD_IMAGES.salad;

  if (
    name.includes("stir fry") ||
    name.includes("stir-fry") ||
    name.includes("tofu") ||
    name.includes("asian") ||
    name.includes("bok choy")
  )
    return FOOD_IMAGES.stirfry;

  if (
    name.includes("bowl") ||
    name.includes("wrap") ||
    name.includes("hummus") ||
    name.includes("taco") ||
    name.includes("platter") ||
    mealType === "lunch"
  )
    return FOOD_IMAGES.lunchBowl;

  return FOOD_IMAGES.dinner;
}

export default FOOD_IMAGES;
