import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { NUTRIENTS } from "@/constants/nutrients";
import { useApp } from "@/context/AppContext";

function NutrientCard({
  nutrient,
  selected,
  onPress,
}: {
  nutrient: (typeof NUTRIENTS)[0];
  selected: boolean;
  onPress: () => void;
}) {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const colors = Colors.light;

  return (
    <Animated.View style={{ transform: [{ scale }], width: "48%" }}>
      <Pressable
        onPress={handlePress}
        style={[
          styles.nutrientCard,
          {
            backgroundColor: selected ? nutrient.color : colors.backgroundCard,
            borderColor: selected ? nutrient.color : colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.nutrientIconWrap,
            {
              backgroundColor: selected
                ? "rgba(255,255,255,0.2)"
                : nutrient.color + "18",
            },
          ]}
        >
          <Feather
            name={nutrient.icon as any}
            size={20}
            color={selected ? "#fff" : nutrient.color}
          />
        </View>
        <Text
          style={[
            styles.nutrientName,
            { color: selected ? "#fff" : colors.text },
          ]}
        >
          {nutrient.name}
        </Text>
        <Text
          style={[
            styles.nutrientGoal,
            { color: selected ? "rgba(255,255,255,0.7)" : colors.textMuted },
          ]}
          numberOfLines={2}
        >
          {nutrient.description}
        </Text>
        {selected && (
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark" size={12} color="#fff" />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const colors = Colors.light;
  const { state, selectNutrient, deselectNutrient, generatePlan } = useApp();
  const [step, setStep] = useState(0);

  const handleNutrientToggle = (id: string) => {
    if (state.selectedNutrients.includes(id)) {
      deselectNutrient(id);
    } else {
      if (state.selectedNutrients.length >= 4) return;
      selectNutrient(id);
    }
  };

  const handleGenerate = () => {
    if (state.selectedNutrients.length === 0) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    generatePlan();
    router.replace("/(tabs)");
  };

  const topPad =
    Platform.OS === "web" ? 67 : insets.top;

  if (step === 0) {
    return (
      <View
        style={[styles.container, { backgroundColor: colors.tint, paddingTop: topPad }]}
      >
        <View style={styles.welcomeContent}>
          <View style={styles.logoCircle}>
            <Feather name="trending-up" size={40} color="#fff" />
          </View>
          <Text style={styles.welcomeTitle}>NutriPlan</Text>
          <Text style={styles.welcomeSubtitle}>
            Personalized meal plans designed around your nutritional needs
          </Text>
          <View style={styles.featureList}>
            {[
              { icon: "target", text: "Target specific vitamins & minerals" },
              { icon: "calendar", text: "Weekly meal plans tailored for you" },
              { icon: "shopping-cart", text: "Auto-generated grocery lists" },
              { icon: "book", text: "Wellness journal & intake tracker" },
            ].map((f) => (
              <View key={f.icon} style={styles.featureRow}>
                <View style={styles.featureIconWrap}>
                  <Feather name={f.icon as any} size={16} color={colors.tint} />
                </View>
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            ))}
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            { opacity: pressed ? 0.9 : 1, marginBottom: insets.bottom + 32 },
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setStep(1);
          }}
        >
          <Text style={styles.primaryBtnText}>Get Started</Text>
          <Feather name="arrow-right" size={20} color={colors.tint} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <View style={styles.header}>
        <Text style={[styles.stepTitle, { color: colors.text }]}>
          What do you want to improve?
        </Text>
        <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
          Select up to 4 nutrients — we'll build your personalized meal plan
        </Text>
        <View style={styles.selectionCounter}>
          <Text style={[styles.counterText, { color: colors.tint }]}>
            {state.selectedNutrients.length}/4 selected
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.nutrientGrid}
        showsVerticalScrollIndicator={false}
      >
        {NUTRIENTS.map((nutrient) => (
          <NutrientCard
            key={nutrient.id}
            nutrient={nutrient}
            selected={state.selectedNutrients.includes(nutrient.id)}
            onPress={() => handleNutrientToggle(nutrient.id)}
          />
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      <View
        style={[
          styles.bottomCta,
          {
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.generateBtn,
            {
              backgroundColor:
                state.selectedNutrients.length > 0
                  ? colors.tint
                  : colors.border,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
          onPress={handleGenerate}
          disabled={state.selectedNutrients.length === 0}
        >
          <Feather name="zap" size={20} color="#fff" />
          <Text style={styles.generateBtnText}>Generate My Plan</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  featureList: {
    width: "100%",
    gap: 12,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.9)",
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 16,
    gap: 10,
  },
  primaryBtnText: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    color: "#1A7A5A",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  stepTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  selectionCounter: {
    marginTop: 12,
  },
  counterText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  nutrientGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },
  nutrientCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    position: "relative",
  },
  nutrientIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  nutrientName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  nutrientGoal: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 16,
  },
  checkBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomCta: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    borderRadius: 16,
    gap: 10,
  },
  generateBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
});
