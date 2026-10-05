import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
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
import { getMealImage } from "@/constants/mealImages";
import { NUTRIENTS } from "@/constants/nutrients";
import { useApp } from "@/context/AppContext";

const mealTypeColors = {
  breakfast: "#F39C12",
  lunch: "#27AE60",
  dinner: "#2980B9",
};

export default function MealDetailScreen() {
  const { mealId } = useLocalSearchParams<{ mealId: string }>();
  const insets = useSafeAreaInsets();
  const colors = Colors.light;
  const { state, toggleMealConsumed } = useApp();

  const meal = state.weeklyMeals.find((m) => m.id === mealId);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (!meal) {
    return (
      <View
        style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: colors.textMuted }]}>
            Meal not found
          </Text>
        </View>
      </View>
    );
  }

  const typeColor = mealTypeColors[meal.type as keyof typeof mealTypeColors] ?? colors.tint;
  const relatedNutrients = meal.nutrients
    .map((id) => NUTRIENTS.find((n) => n.id === id))
    .filter(Boolean);

  const mealImage = getMealImage(meal.name, meal.type);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Hero Image */}
      <View style={[styles.heroImageWrap, { height: 240 + topPad }]}>
        <Image source={mealImage} style={StyleSheet.absoluteFill} resizeMode="cover" />
        {/* Gradient-like dark overlay at bottom */}
        <View style={styles.heroGradient} />
        {/* Back button over image */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backBtnOnImage,
            { top: topPad + 8, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Feather name="arrow-left" size={20} color="#fff" />
        </Pressable>
        {/* Consumed badge */}
        {meal.consumed && (
          <View style={[styles.consumedBadge, { top: topPad + 8 }]}>
            <Feather name="check-circle" size={14} color="#fff" />
            <Text style={styles.consumedBadgeText}>Consumed</Text>
          </View>
        )}
        {/* Title on image */}
        <View style={[styles.heroTextOnImage, { paddingBottom: 20 }]}>
          <View style={[styles.typeChip, { backgroundColor: typeColor }]}>
            <Text style={styles.typeChipText}>
              {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)} · {meal.day}
            </Text>
          </View>
          <Text style={styles.heroTitleOnImage} numberOfLines={2}>
            {meal.name}
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.backgroundCard }]}>
            <Feather name="zap" size={16} color={typeColor} />
            <Text style={[styles.statValue, { color: colors.text }]}>{meal.calories}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>kcal</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.backgroundCard }]}>
            <Feather name="clock" size={16} color={typeColor} />
            <Text style={[styles.statValue, { color: colors.text }]}>{meal.prepTime}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>prep</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.backgroundCard }]}>
            <Feather name="list" size={16} color={typeColor} />
            <Text style={[styles.statValue, { color: colors.text }]}>{meal.ingredients.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>ingredients</Text>
          </View>
        </View>

        {/* Health Benefits */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Health Benefits</Text>
          <View
            style={[
              styles.benefitCard,
              { backgroundColor: colors.tint + "10", borderColor: colors.tint + "30" },
            ]}
          >
            <Feather name="award" size={18} color={colors.tint} style={{ marginTop: 2 }} />
            <Text style={[styles.benefitText, { color: colors.text }]}>{meal.benefits}</Text>
          </View>
        </View>

        {/* Nutrients Targeted */}
        {relatedNutrients.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Nutrients Targeted</Text>
            <View style={styles.nutrientChips}>
              {relatedNutrients.map(
                (n) =>
                  n && (
                    <View
                      key={n.id}
                      style={[
                        styles.nutrientChip,
                        { backgroundColor: n.color + "18", borderColor: n.color + "30" },
                      ]}
                    >
                      <Feather name={n.icon as any} size={12} color={n.color} />
                      <Text style={[styles.nutrientChipText, { color: n.color }]}>{n.name}</Text>
                      <Text style={[styles.nutrientGoal, { color: n.color + "aa" }]}>
                        {n.dailyGoal}/day
                      </Text>
                    </View>
                  )
              )}
            </View>
          </View>
        )}

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ingredients</Text>
          <View style={[styles.ingredientList, { backgroundColor: colors.backgroundCard }]}>
            {meal.ingredients.map((ing, idx) => (
              <View key={ing + idx}>
                <View style={styles.ingredientRow}>
                  <View style={[styles.ingredientDot, { backgroundColor: typeColor }]} />
                  <Text style={[styles.ingredientText, { color: colors.text }]}>
                    {ing.charAt(0).toUpperCase() + ing.slice(1)}
                  </Text>
                </View>
                {idx < meal.ingredients.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View
        style={[
          styles.cta,
          {
            backgroundColor: colors.background,
            paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 16,
            borderTopColor: colors.border,
          },
        ]}
      >
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            toggleMealConsumed(meal.id);
          }}
          style={({ pressed }) => [
            styles.ctaBtn,
            {
              backgroundColor: meal.consumed ? colors.success : colors.tint,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Ionicons
            name={meal.consumed ? "checkmark-circle" : "checkmark-circle-outline"}
            size={22}
            color="#fff"
          />
          <Text style={styles.ctaBtnText}>
            {meal.consumed ? "Logged as Consumed" : "Mark as Consumed"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroImageWrap: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: "transparent",
    // Simulated gradient via layered views
  },
  backBtnOnImage: {
    position: "absolute",
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  consumedBadge: {
    position: "absolute",
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  consumedBadgeText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  heroTextOnImage: {
    paddingHorizontal: 16,
    paddingTop: 60,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  typeChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  typeChipText: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: "#fff" },
  heroTitleOnImage: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    lineHeight: 30,
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    gap: 4,
  },
  statValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 12 },
  benefitCard: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  nutrientChips: { gap: 8 },
  nutrientChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  nutrientChipText: { fontSize: 13, fontFamily: "Inter_600SemiBold", flex: 1 },
  nutrientGoal: { fontSize: 11, fontFamily: "Inter_400Regular" },
  ingredientList: { borderRadius: 16, overflow: "hidden" },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  ingredientDot: { width: 6, height: 6, borderRadius: 3 },
  ingredientText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  divider: { height: 1, marginLeft: 34 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
  },
  cta: { padding: 20, paddingTop: 12, borderTopWidth: 1 },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
  },
  ctaBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFoundText: { fontSize: 16, fontFamily: "Inter_400Regular" },
});
