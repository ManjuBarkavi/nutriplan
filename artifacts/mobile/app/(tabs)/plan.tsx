import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { DAYS_OF_WEEK, DayOfWeek, Meal } from "@/constants/nutrients";
import { getMealImage } from "@/constants/mealImages";
import { useApp } from "@/context/AppContext";

const MEAL_TYPE_ORDER = ["breakfast", "lunch", "dinner"];

const mealTypeConfig = {
  breakfast: { label: "Breakfast", color: "#F39C12", icon: "coffee" },
  lunch: { label: "Lunch", color: "#27AE60", icon: "sun" },
  dinner: { label: "Dinner", color: "#2980B9", icon: "moon" },
};

function MealCard({
  meal,
  onToggle,
}: {
  meal: Meal;
  onToggle: () => void;
}) {
  const colors = Colors.light;
  const config = mealTypeConfig[meal.type as keyof typeof mealTypeConfig] ?? mealTypeConfig.dinner;
  const mealImage = getMealImage(meal.name, meal.type);

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/meal-detail", params: { mealId: meal.id } })
      }
      style={({ pressed }) => [
        styles.mealCard,
        { backgroundColor: colors.backgroundCard, opacity: pressed ? 0.92 : 1 },
      ]}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image source={mealImage} style={styles.mealImage} resizeMode="cover" />
        <View style={styles.imageOverlay} />
        {/* Consumed overlay */}
        {meal.consumed && (
          <View style={styles.consumedOverlay}>
            <Feather name="check-circle" size={28} color="#fff" />
          </View>
        )}
        {/* Type badge on image */}
        <View style={[styles.typeBadgeOnImage, { backgroundColor: config.color }]}>
          <Feather name={config.icon as any} size={10} color="#fff" />
          <Text style={styles.typeBadgeOnImageText}>{config.label}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <View style={styles.cardTopRow}>
          <Text style={[styles.mealCardName, { color: colors.text }]} numberOfLines={2}>
            {meal.name}
          </Text>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onToggle();
            }}
            style={[
              styles.consumeBtn,
              {
                backgroundColor: meal.consumed ? colors.tint : "transparent",
                borderColor: meal.consumed ? colors.tint : colors.border,
              },
            ]}
          >
            <Feather
              name={meal.consumed ? "check" : "circle"}
              size={14}
              color={meal.consumed ? "#fff" : colors.muted}
            />
          </Pressable>
        </View>

        <Text
          style={[styles.mealCardBenefit, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {meal.benefits}
        </Text>

        <View style={styles.mealCardFooter}>
          <View style={styles.metaChip}>
            <Feather name="zap" size={10} color={colors.textMuted} />
            <Text style={[styles.metaChipText, { color: colors.textMuted }]}>
              {meal.calories} kcal
            </Text>
          </View>
          <View style={styles.metaChip}>
            <Feather name="clock" size={10} color={colors.textMuted} />
            <Text style={[styles.metaChipText, { color: colors.textMuted }]}>
              {meal.prepTime}
            </Text>
          </View>
          <Feather name="chevron-right" size={14} color={colors.muted} />
        </View>
      </View>
    </Pressable>
  );
}

export default function PlanScreen() {
  const insets = useSafeAreaInsets();
  const colors = Colors.light;
  const { state, getMealsByDay, toggleMealConsumed, generatePlan } = useApp();

  const today = new Date().toLocaleString("en-US", { weekday: "long" }) as DayOfWeek;
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(today);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const dayMeals = getMealsByDay(selectedDay);

  const sortedMeals = [...dayMeals].sort(
    (a, b) =>
      MEAL_TYPE_ORDER.indexOf(a.type) - MEAL_TYPE_ORDER.indexOf(b.type)
  );

  if (state.weeklyMeals.length === 0) {
    return (
      <View
        style={[
          styles.emptyContainer,
          { backgroundColor: colors.background, paddingTop: topPad },
        ]}
      >
        <View style={[styles.emptyIcon, { backgroundColor: colors.tint + "18" }]}>
          <Feather name="calendar" size={40} color={colors.tint} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          No plan generated
        </Text>
        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
          Set your nutritional goals to generate a weekly meal plan
        </Text>
        <Pressable
          onPress={() => router.push("/onboarding")}
          style={({ pressed }) => [
            styles.emptyBtn,
            { backgroundColor: colors.tint, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={styles.emptyBtnText}>Set Up Plan</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 8, backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Weekly Plan
        </Text>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              generatePlan();
            }}
            style={({ pressed }) => [
              styles.headerBtn,
              { backgroundColor: colors.tint + "18", opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Feather name="refresh-cw" size={16} color={colors.tint} />
          </Pressable>
          <Pressable
            onPress={() => router.push("/add-meal")}
            style={({ pressed }) => [
              styles.headerBtn,
              { backgroundColor: colors.tint, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Feather name="plus" size={16} color="#fff" />
          </Pressable>
        </View>
      </View>

      {/* Day Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dayScrollWrap}
        contentContainerStyle={styles.dayScroll}
      >
        {DAYS_OF_WEEK.map((day) => {
          const dayMealCount = getMealsByDay(day).length;
          const consumed = getMealsByDay(day).filter((m) => m.consumed).length;
          const isSelected = day === selectedDay;
          const isToday = day === today;

          return (
            <Pressable
              key={day}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedDay(day);
              }}
              style={[
                styles.dayChip,
                {
                  backgroundColor: isSelected ? colors.tint : colors.backgroundCard,
                  borderColor: isToday && !isSelected ? colors.tint : "transparent",
                  borderWidth: isToday && !isSelected ? 1.5 : 0,
                },
              ]}
            >
              <Text
                style={[
                  styles.dayChipLabel,
                  {
                    color: isSelected ? "#fff" : isToday ? colors.tint : colors.text,
                  },
                ]}
              >
                {day.slice(0, 3)}
              </Text>
              {dayMealCount > 0 && (
                <View
                  style={[
                    styles.dayProgress,
                    { backgroundColor: isSelected ? "rgba(255,255,255,0.3)" : colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.dayProgressFill,
                      {
                        backgroundColor: isSelected ? "#fff" : colors.tint,
                        width: `${(consumed / dayMealCount) * 100}%`,
                      },
                    ]}
                  />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Meals List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.mealsList,
          { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {sortedMeals.length === 0 ? (
          <View style={styles.noMeals}>
            <Feather name="moon" size={28} color={colors.muted} />
            <Text style={[styles.noMealsText, { color: colors.textMuted }]}>
              No meals for this day
            </Text>
            <Pressable
              onPress={() => router.push("/add-meal")}
              style={({ pressed }) => [
                styles.addMealBtn,
                { borderColor: colors.tint, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name="plus" size={14} color={colors.tint} />
              <Text style={[styles.addMealBtnText, { color: colors.tint }]}>
                Add a meal
              </Text>
            </Pressable>
          </View>
        ) : (
          sortedMeals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onToggle={() => toggleMealConsumed(meal.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 26, fontFamily: "Inter_700Bold" },
  headerActions: { flexDirection: "row", gap: 8 },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dayScrollWrap: { flexGrow: 0 },
  dayScroll: { paddingHorizontal: 20, gap: 8, paddingBottom: 16 },
  dayChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    minWidth: 56,
    gap: 6,
  },
  dayChipLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  dayProgress: { width: 32, height: 3, borderRadius: 2, overflow: "hidden" },
  dayProgressFill: { height: 3 },
  mealsList: { paddingHorizontal: 20, paddingTop: 4 },
  mealCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: 160,
    position: "relative",
  },
  mealImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  consumedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26,122,90,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  typeBadgeOnImage: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  typeBadgeOnImageText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  cardContent: { padding: 14 },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 6,
    gap: 8,
  },
  mealCardName: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 22,
  },
  consumeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  mealCardBenefit: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
    marginBottom: 10,
  },
  mealCardFooter: { flexDirection: "row", alignItems: "center", gap: 8 },
  metaChip: { flexDirection: "row", alignItems: "center", gap: 4, flex: 1 },
  metaChipText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 20, fontFamily: "Inter_700Bold", marginBottom: 8 },
  emptyDesc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyBtn: { paddingVertical: 14, paddingHorizontal: 28, borderRadius: 14 },
  emptyBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff" },
  noMeals: { alignItems: "center", justifyContent: "center", paddingVertical: 60, gap: 12 },
  noMealsText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  addMealBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    marginTop: 4,
  },
  addMealBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});
