import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { DAYS_OF_WEEK, DayOfWeek, MealType, NUTRIENTS } from "@/constants/nutrients";
import { useApp } from "@/context/AppContext";

const MEAL_TYPES: { value: MealType; label: string; icon: string; color: string }[] = [
  { value: "breakfast", label: "Breakfast", icon: "coffee", color: "#F39C12" },
  { value: "lunch", label: "Lunch", icon: "sun", color: "#27AE60" },
  { value: "dinner", label: "Dinner", icon: "moon", color: "#2980B9" },
];

export default function AddMealScreen() {
  const insets = useSafeAreaInsets();
  const colors = Colors.light;
  const { addCustomMeal } = useApp();

  const [name, setName] = useState("");
  const [mealType, setMealType] = useState<MealType>("lunch");
  const [day, setDay] = useState<DayOfWeek>(
    new Date().toLocaleString("en-US", { weekday: "long" }) as DayOfWeek
  );
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [benefits, setBenefits] = useState("");
  const [calories, setCalories] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [selectedNutrients, setSelectedNutrients] = useState<string[]>([]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const addIngredientField = () => {
    if (ingredients.length >= 20) return;
    setIngredients([...ingredients, ""]);
  };

  const updateIngredient = (idx: number, value: string) => {
    const updated = [...ingredients];
    updated[idx] = value;
    setIngredients(updated);
  };

  const removeIngredient = (idx: number) => {
    if (ingredients.length <= 1) return;
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const toggleNutrient = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedNutrients((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Missing name", "Please enter a meal name.");
      return;
    }
    const validIngredients = ingredients.filter((i) => i.trim().length > 0);
    if (validIngredients.length === 0) {
      Alert.alert("Missing ingredients", "Add at least one ingredient.");
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addCustomMeal({
      name: name.trim(),
      type: mealType,
      day,
      ingredients: validIngredients,
      benefits: benefits.trim() || "Custom meal added by you",
      calories: parseInt(calories) || 400,
      prepTime: prepTime.trim() || "20 min",
      nutrients: selectedNutrients,
    });
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Add Custom Meal</Text>
        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveBtn,
            { backgroundColor: colors.tint, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.saveBtnText}>Save</Text>
        </Pressable>
      </View>

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Platform.OS === "web" ? 60 : insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
      >
        {/* Meal Name */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Meal Name *</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Avocado Chicken Bowl"
            placeholderTextColor={colors.muted}
            style={[
              styles.input,
              {
                color: colors.text,
                backgroundColor: colors.backgroundCard,
                borderColor: name ? colors.tint : colors.border,
              },
            ]}
          />
        </View>

        {/* Meal Type */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Meal Type</Text>
          <View style={styles.typeRow}>
            {MEAL_TYPES.map((t) => (
              <Pressable
                key={t.value}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setMealType(t.value);
                }}
                style={[
                  styles.typeBtn,
                  {
                    backgroundColor:
                      mealType === t.value ? t.color : colors.backgroundCard,
                    borderColor:
                      mealType === t.value ? t.color : colors.border,
                  },
                ]}
              >
                <Feather
                  name={t.icon as any}
                  size={16}
                  color={mealType === t.value ? "#fff" : t.color}
                />
                <Text
                  style={[
                    styles.typeBtnText,
                    { color: mealType === t.value ? "#fff" : colors.text },
                  ]}
                >
                  {t.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Day */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Day of the Week</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
            {DAYS_OF_WEEK.map((d) => (
              <Pressable
                key={d}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setDay(d);
                }}
                style={[
                  styles.dayChip,
                  {
                    backgroundColor: day === d ? colors.tint : colors.backgroundCard,
                    borderColor: day === d ? colors.tint : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayChipText,
                    { color: day === d ? "#fff" : colors.text },
                  ]}
                >
                  {d.slice(0, 3)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Ingredients *
          </Text>
          <View
            style={[styles.ingredientCard, { backgroundColor: colors.backgroundCard }]}
          >
            {ingredients.map((ing, idx) => (
              <View key={idx} style={styles.ingredientRow}>
                <View style={[styles.ingDot, { backgroundColor: colors.tint }]} />
                <TextInput
                  value={ing}
                  onChangeText={(v) => updateIngredient(idx, v)}
                  placeholder={`Ingredient ${idx + 1}`}
                  placeholderTextColor={colors.muted}
                  style={[styles.ingInput, { color: colors.text }]}
                  returnKeyType="next"
                />
                {ingredients.length > 1 && (
                  <Pressable
                    onPress={() => removeIngredient(idx)}
                    hitSlop={8}
                  >
                    <Feather name="x" size={16} color={colors.muted} />
                  </Pressable>
                )}
              </View>
            ))}
            <Pressable
              onPress={addIngredientField}
              style={({ pressed }) => [
                styles.addIngBtn,
                { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name="plus" size={14} color={colors.tint} />
              <Text style={[styles.addIngBtnText, { color: colors.tint }]}>
                Add ingredient
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Health Benefits */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Health Benefits
          </Text>
          <TextInput
            value={benefits}
            onChangeText={setBenefits}
            placeholder="Describe the nutritional benefits of this meal..."
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={3}
            style={[
              styles.textArea,
              {
                color: colors.text,
                backgroundColor: colors.backgroundCard,
                borderColor: colors.border,
              },
            ]}
          />
        </View>

        {/* Nutrients */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Nutrients (optional)
          </Text>
          <View style={styles.nutrientGrid}>
            {NUTRIENTS.map((n) => {
              const selected = selectedNutrients.includes(n.id);
              return (
                <Pressable
                  key={n.id}
                  onPress={() => toggleNutrient(n.id)}
                  style={[
                    styles.nutrientChip,
                    {
                      backgroundColor: selected ? n.color : colors.backgroundCard,
                      borderColor: selected ? n.color : colors.border,
                    },
                  ]}
                >
                  <Feather
                    name={n.icon as any}
                    size={12}
                    color={selected ? "#fff" : n.color}
                  />
                  <Text
                    style={[
                      styles.nutrientChipText,
                      { color: selected ? "#fff" : colors.text },
                    ]}
                  >
                    {n.name}
                  </Text>
                  {selected && (
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Optional Meta */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Optional Details
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.metaField}>
              <Text style={[styles.metaLabel, { color: colors.textMuted }]}>
                Calories
              </Text>
              <TextInput
                value={calories}
                onChangeText={setCalories}
                placeholder="400"
                placeholderTextColor={colors.muted}
                keyboardType="number-pad"
                style={[
                  styles.metaInput,
                  {
                    color: colors.text,
                    backgroundColor: colors.backgroundCard,
                    borderColor: colors.border,
                  },
                ]}
              />
            </View>
            <View style={styles.metaField}>
              <Text style={[styles.metaLabel, { color: colors.textMuted }]}>
                Prep Time
              </Text>
              <TextInput
                value={prepTime}
                onChangeText={setPrepTime}
                placeholder="20 min"
                placeholderTextColor={colors.muted}
                style={[
                  styles.metaInput,
                  {
                    color: colors.text,
                    backgroundColor: colors.backgroundCard,
                    borderColor: colors.border,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Save button at bottom */}
        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            styles.bottomSaveBtn,
            { backgroundColor: colors.tint, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Feather name="check" size={20} color="#fff" />
          <Text style={styles.bottomSaveBtnText}>Add to My Plan</Text>
        </Pressable>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  saveBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#fff" },
  scrollContent: { paddingHorizontal: 20 },
  section: { marginBottom: 24 },
  label: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  typeRow: { flexDirection: "row", gap: 10 },
  typeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  typeBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  dayScroll: { flexGrow: 0 },
  dayChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    marginRight: 8,
  },
  dayChipText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  ingredientCard: { borderRadius: 16, overflow: "hidden" },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  ingDot: { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  ingInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    paddingVertical: 0,
  },
  addIngBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  addIngBtnText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  textArea: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    minHeight: 90,
    textAlignVertical: "top",
  },
  nutrientGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  nutrientChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  nutrientChipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  metaRow: { flexDirection: "row", gap: 12 },
  metaField: { flex: 1 },
  metaLabel: { fontSize: 11, fontFamily: "Inter_500Medium", marginBottom: 6 },
  metaInput: {
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  bottomSaveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    borderRadius: 16,
    gap: 10,
    marginTop: 8,
  },
  bottomSaveBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
});
