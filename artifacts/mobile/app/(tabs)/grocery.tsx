import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const CATEGORY_ICONS: Record<string, string> = {
  Proteins: "award",
  Produce: "feather",
  Dairy: "droplet",
  Grains: "layers",
  "Nuts & Seeds": "circle",
  Pantry: "box",
  Other: "more-horizontal",
};

const CATEGORY_COLORS: Record<string, string> = {
  Proteins: "#E74C3C",
  Produce: "#27AE60",
  Dairy: "#3498DB",
  Grains: "#F39C12",
  "Nuts & Seeds": "#8E44AD",
  Pantry: "#16A085",
  Other: "#95A5A6",
};

function GroceryItem({
  item,
  onToggle,
}: {
  item: { id: string; name: string; amount?: string; checked: boolean };
  onToggle: () => void;
}) {
  const colors = Colors.light;

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onToggle();
      }}
      style={[styles.groceryItem, { opacity: item.checked ? 0.5 : 1 }]}
    >
      <View
        style={[
          styles.checkCircle,
          {
            backgroundColor: item.checked ? colors.tint : "transparent",
            borderColor: item.checked ? colors.tint : colors.border,
          },
        ]}
      >
        {item.checked && <Ionicons name="checkmark" size={14} color="#fff" />}
      </View>
      <Text
        style={[
          styles.itemName,
          {
            color: colors.text,
            textDecorationLine: item.checked ? "line-through" : "none",
          },
        ]}
      >
        {item.name}
      </Text>
      {!!item.amount && (
        <Text style={[styles.itemAmount, { color: colors.textMuted }]}>
          {item.amount}
        </Text>
      )}
    </Pressable>
  );
}

export default function GroceryScreen() {
  const insets = useSafeAreaInsets();
  const colors = Colors.light;
  const { state, getGroceryByCategory, toggleGroceryItem } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const byCategory = getGroceryByCategory();
  const categories = Object.keys(byCategory).sort();

  const stats = useMemo(() => {
    const total = state.groceryItems.length;
    const checked = state.groceryItems.filter((i) => i.checked).length;
    return { total, checked };
  }, [state.groceryItems]);

  if (state.groceryItems.length === 0) {
    return (
      <View
        style={[
          styles.emptyContainer,
          { backgroundColor: colors.background, paddingTop: topPad },
        ]}
      >
        <View
          style={[styles.emptyIcon, { backgroundColor: colors.tint + "18" }]}
        >
          <Feather name="shopping-cart" size={40} color={colors.tint} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          Your list is empty
        </Text>
        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
          Generate a meal plan and your grocery list will appear here automatically
        </Text>
      </View>
    );
  }

  const progress = stats.total > 0 ? stats.checked / stats.total : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 8, backgroundColor: colors.background },
        ]}
      >
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Grocery List
          </Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>
            {stats.checked}/{stats.total} items checked
          </Text>
        </View>
        {/* Progress ring stub */}
        <View
          style={[
            styles.progressRing,
            { borderColor: colors.tint, backgroundColor: colors.tint + "18" },
          ]}
        >
          <Text style={[styles.progressPct, { color: colors.tint }]}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={[styles.progressWrap, { paddingHorizontal: 20 }]}>
        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.tint,
                width: `${progress * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              Platform.OS === "web" ? 100 : insets.bottom + 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((cat) => {
          const items = byCategory[cat];
          const catColor = CATEGORY_COLORS[cat] ?? "#95A5A6";
          const catIcon = CATEGORY_ICONS[cat] ?? "list";

          return (
            <View key={cat} style={styles.category}>
              <View style={styles.categoryHeader}>
                <View
                  style={[
                    styles.catIconWrap,
                    { backgroundColor: catColor + "18" },
                  ]}
                >
                  <Feather name={catIcon as any} size={14} color={catColor} />
                </View>
                <Text style={[styles.categoryTitle, { color: colors.text }]}>
                  {cat}
                </Text>
                <Text style={[styles.categoryCount, { color: colors.muted }]}>
                  {items.filter((i) => i.checked).length}/{items.length}
                </Text>
              </View>
              <View
                style={[
                  styles.categoryCard,
                  { backgroundColor: colors.backgroundCard },
                ]}
              >
                {items.map((item, idx) => (
                  <View key={item.id}>
                    <GroceryItem
                      item={item}
                      onToggle={() => toggleGroceryItem(item.id)}
                    />
                    {idx < items.length - 1 && (
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: colors.borderLight },
                        ]}
                      />
                    )}
                  </View>
                ))}
              </View>
            </View>
          );
        })}
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
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  progressRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },
  progressPct: { fontSize: 13, fontFamily: "Inter_700Bold" },
  progressWrap: { marginBottom: 16 },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: 6, borderRadius: 3 },
  scrollContent: { paddingHorizontal: 20 },
  category: { marginBottom: 20 },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  catIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  categoryCount: { fontSize: 12, fontFamily: "Inter_400Regular" },
  categoryCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  groceryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  itemAmount: { fontSize: 12, fontFamily: "Inter_500Medium" },
  divider: { height: 1, marginLeft: 52 },
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
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
});
