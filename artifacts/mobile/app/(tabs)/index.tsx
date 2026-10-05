import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  Animated,
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
import { DAYS_OF_WEEK, NUTRIENTS } from "@/constants/nutrients";
import { useApp } from "@/context/AppContext";

function NutrientProgressBar({
  nutrientId,
  progress,
}: {
  nutrientId: string;
  progress: number;
}) {
  const nutrient = NUTRIENTS.find((n) => n.id === nutrientId);
  const anim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  if (!nutrient) return null;

  return (
    <View style={progressStyles.container}>
      <View style={progressStyles.labelRow}>
        <View
          style={[progressStyles.dot, { backgroundColor: nutrient.color }]}
        />
        <Text style={progressStyles.label}>{nutrient.name}</Text>
        <Text style={[progressStyles.pct, { color: nutrient.color }]}>
          {Math.round(progress * 100)}%
        </Text>
      </View>
      <View style={progressStyles.track}>
        <Animated.View
          style={[
            progressStyles.fill,
            {
              backgroundColor: nutrient.color,
              width: anim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const progressStyles = StyleSheet.create({
  container: { marginBottom: 12 },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  label: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.light.text,
  },
  pct: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  track: {
    height: 6,
    backgroundColor: Colors.light.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: { height: 6, borderRadius: 3 },
});

function MealRow({
  meal,
  onPress,
  onToggle,
}: {
  meal: any;
  onPress: () => void;
  onToggle: () => void;
}) {
  const colors = Colors.light;
  const mealTypeColors = {
    breakfast: "#F39C12",
    lunch: "#27AE60",
    dinner: "#2980B9",
  };
  const typeColor = mealTypeColors[meal.type as keyof typeof mealTypeColors];

  const mealImage = getMealImage(meal.name, meal.type);

  return (
    <Pressable onPress={onPress} style={mealStyles.row}>
      {/* Thumbnail */}
      <View style={mealStyles.thumbnail}>
        <Image source={mealImage} style={mealStyles.thumbnailImage} resizeMode="cover" />
        {meal.consumed && (
          <View style={mealStyles.thumbnailConsumed}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
          </View>
        )}
      </View>
      <View style={mealStyles.rowContent}>
        <View style={mealStyles.rowMain}>
          <Text style={mealStyles.mealName} numberOfLines={1}>
            {meal.name}
          </Text>
          <Text style={[mealStyles.mealType, { color: typeColor }]}>
            {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
          </Text>
        </View>
        <View style={mealStyles.rowMeta}>
          <Text style={mealStyles.calories}>{meal.calories} kcal</Text>
          <Text style={mealStyles.prepTime}>{meal.prepTime}</Text>
        </View>
      </View>
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onToggle();
        }}
        style={[
          mealStyles.checkBtn,
          { backgroundColor: meal.consumed ? colors.tint : colors.border },
        ]}
      >
        <Ionicons
          name="checkmark"
          size={16}
          color={meal.consumed ? "#fff" : colors.muted}
        />
      </Pressable>
    </Pressable>
  );
}

const mealStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundCard,
    borderRadius: 14,
    marginBottom: 8,
    overflow: "hidden",
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeBar: { width: 4, alignSelf: "stretch" },
  thumbnail: {
    width: 72,
    height: 72,
    position: "relative",
    overflow: "hidden",
  },
  thumbnailImage: { width: "100%", height: "100%" },
  thumbnailConsumed: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26,122,90,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  rowContent: { flex: 1, paddingVertical: 12, paddingHorizontal: 12 },
  rowMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  mealName: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.light.text,
    marginRight: 8,
  },
  mealType: { fontSize: 11, fontFamily: "Inter_500Medium" },
  rowMeta: { flexDirection: "row", gap: 12 },
  calories: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textMuted,
  },
  prepTime: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textMuted,
  },
  checkBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
});

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colors = Colors.light;
  const { state, isLoading, getMealsByDay, getNutrientProgress, toggleMealConsumed, getTodayEntry } =
    useApp();

  const today = new Date().toLocaleString("en-US", { weekday: "long" });
  const todayMeals = getMealsByDay(today);
  const todayEntry = getTodayEntry();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  useEffect(() => {
    if (!isLoading && state.weeklyMeals.length === 0) {
      router.replace("/onboarding");
    }
  }, [isLoading, state.weeklyMeals.length]);

  if (state.weeklyMeals.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]} />
    );
  }

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const totalConsumed = todayMeals.filter((m) => m.consumed).length;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: topPad + 8, paddingBottom: 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.greeting, { color: colors.textMuted }]}>
            {dateStr}
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>
            Good{" "}
            {new Date().getHours() < 12
              ? "morning"
              : new Date().getHours() < 17
              ? "afternoon"
              : "evening"}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/onboarding")}
          style={({ pressed }) => [
            styles.profileBtn,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <View style={[styles.profileAvatar, { backgroundColor: colors.tint }]}>
            <Feather name="user" size={20} color="#fff" />
          </View>
          <View style={[styles.profileBadge, { backgroundColor: colors.accent, borderColor: colors.background }]}>
            <Feather name="settings" size={9} color="#fff" />
          </View>
        </Pressable>
      </View>

      {/* Today's Summary Card */}
      <View style={[styles.summaryCard, { backgroundColor: colors.tint }]}>
        <View style={styles.summaryLeft}>
          <Text style={styles.summaryLabel}>Today's Progress</Text>
          <Text style={styles.summaryBig}>
            {totalConsumed}/{todayMeals.length}
          </Text>
          <Text style={styles.summaryDesc}>meals logged</Text>
        </View>
        <View style={styles.summaryRight}>
          {state.selectedNutrients.slice(0, 3).map((nId) => {
            const n = NUTRIENTS.find((x) => x.id === nId);
            const prog = getNutrientProgress(nId);
            return (
              <View key={nId} style={styles.miniNutrient}>
                <View style={[styles.miniDot, { backgroundColor: n?.color ?? "#fff" }]} />
                <Text style={styles.miniName}>{n?.name}</Text>
                <Text style={styles.miniPct}>{Math.round(prog * 100)}%</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Nutrient Progress */}
      {state.selectedNutrients.length > 0 && (
        <View
          style={[styles.section, { backgroundColor: colors.backgroundCard }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Today's Nutrients
          </Text>
          {state.selectedNutrients.map((id) => (
            <NutrientProgressBar
              key={id}
              nutrientId={id}
              progress={getNutrientProgress(id)}
            />
          ))}
        </View>
      )}

      {/* Today's Meals */}
      <View style={styles.todayHeader}>
        <Text style={[styles.sectionLabel, { color: colors.text }]}>
          {today}'s Meals
        </Text>
        <Pressable onPress={() => router.push("/(tabs)/plan")}>
          <Text style={[styles.seeAll, { color: colors.tint }]}>Full plan</Text>
        </Pressable>
      </View>

      {todayMeals.length === 0 ? (
        <View
          style={[styles.emptyDay, { backgroundColor: colors.backgroundCard }]}
        >
          <Text style={[styles.emptyDayText, { color: colors.textMuted }]}>
            No meals scheduled for today
          </Text>
        </View>
      ) : (
        todayMeals.map((meal) => (
          <MealRow
            key={meal.id}
            meal={meal}
            onPress={() =>
              router.push({
                pathname: "/meal-detail",
                params: { mealId: meal.id },
              })
            }
            onToggle={() => toggleMealConsumed(meal.id)}
          />
        ))
      )}

      {/* Journal Prompt */}
      <Pressable
        style={({ pressed }) => [
          styles.journalCard,
          {
            backgroundColor: todayEntry
              ? colors.tint + "12"
              : colors.accent + "12",
            borderColor: todayEntry ? colors.tint + "30" : colors.accent + "30",
            opacity: pressed ? 0.85 : 1,
          },
        ]}
        onPress={() => router.push("/(tabs)/journal")}
      >
        <Feather
          name={todayEntry ? "check-circle" : "edit-3"}
          size={20}
          color={todayEntry ? colors.tint : colors.accent}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text
            style={[
              styles.journalCardTitle,
              { color: todayEntry ? colors.tint : colors.accent },
            ]}
          >
            {todayEntry ? "Journal logged today" : "Log your wellness"}
          </Text>
          <Text style={[styles.journalCardSub, { color: colors.textSecondary }]}>
            {todayEntry
              ? "Tap to review your entry"
              : "How are you feeling today?"}
          </Text>
        </View>
        <Feather name="chevron-right" size={18} color={colors.textMuted} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  loadingContainer: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginBottom: 2,
  },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  profileBtn: {
    position: "relative",
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  profileBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    marginBottom: 20,
  },
  summaryLeft: { flex: 1 },
  summaryLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  summaryBig: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    lineHeight: 48,
  },
  summaryDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.7)",
  },
  summaryRight: { justifyContent: "center", gap: 8 },
  miniNutrient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  miniDot: { width: 6, height: 6, borderRadius: 3 },
  miniName: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
    width: 60,
  },
  miniPct: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 14,
  },
  todayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionLabel: { fontSize: 17, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 14, fontFamily: "Inter_500Medium" },
  emptyDay: {
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  emptyDayText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  journalCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
    borderWidth: 1,
  },
  journalCardTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  journalCardSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
