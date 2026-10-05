import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const MOODS = [
  { value: 1, icon: "frown", label: "Rough", color: "#E74C3C" },
  { value: 2, icon: "meh", label: "Tired", color: "#F39C12" },
  { value: 3, icon: "smile", label: "Okay", color: "#F1C40F" },
  { value: 4, icon: "smile", label: "Good", color: "#2ECC71" },
  { value: 5, icon: "heart", label: "Great", color: "#27AE60" },
];

const ENERGY_LABELS = ["Low", "Moderate", "High", "Peak"];

function JournalEntryCard({ entry }: { entry: any }) {
  const colors = Colors.light;
  const mood = MOODS.find((m) => m.value === entry.mood) ?? MOODS[2];
  const dateStr = new Date(entry.date + "T12:00:00").toLocaleDateString(
    "en-US",
    { weekday: "short", month: "short", day: "numeric" }
  );

  return (
    <View
      style={[
        styles.entryCard,
        { backgroundColor: colors.backgroundCard },
      ]}
    >
      <View style={styles.entryHeader}>
        <Text style={[styles.entryDate, { color: colors.textSecondary }]}>
          {dateStr}
        </Text>
        <View style={styles.entryMeta}>
          <View
            style={[
              styles.moodBadge,
              { backgroundColor: mood.color + "18" },
            ]}
          >
            <Feather name={mood.icon as any} size={12} color={mood.color} />
            <Text style={[styles.moodBadgeText, { color: mood.color }]}>
              {mood.label}
            </Text>
          </View>
          <View
            style={[
              styles.energyBadge,
              { backgroundColor: colors.tint + "18" },
            ]}
          >
            <Feather name="zap" size={12} color={colors.tint} />
            <Text style={[styles.energyBadgeText, { color: colors.tint }]}>
              {ENERGY_LABELS[Math.min(entry.energy - 1, 3)] ?? "—"}
            </Text>
          </View>
        </View>
      </View>
      {!!entry.notes && (
        <Text
          style={[styles.entryNotes, { color: colors.text }]}
          numberOfLines={3}
        >
          {entry.notes}
        </Text>
      )}
    </View>
  );
}

function TodayEntryForm() {
  const colors = Colors.light;
  const { addJournalEntry, updateJournalEntry, getTodayEntry, state } = useApp();
  const todayEntry = getTodayEntry();

  const [mood, setMood] = useState(todayEntry?.mood ?? 3);
  const [energy, setEnergy] = useState(todayEntry?.energy ?? 2);
  const [notes, setNotes] = useState(todayEntry?.notes ?? "");
  const [saved, setSaved] = useState(!!todayEntry);

  const today = new Date().toISOString().split("T")[0];

  const handleSave = () => {
    if (todayEntry) {
      updateJournalEntry(todayEntry.id, { mood, energy, notes });
    } else {
      addJournalEntry({
        date: today,
        mood,
        energy,
        notes,
        consumedMealIds: state.weeklyMeals
          .filter((m) => m.consumed)
          .map((m) => m.id),
      });
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSaved(true);
  };

  return (
    <View style={[styles.todayForm, { backgroundColor: colors.backgroundCard }]}>
      <Text style={[styles.todayTitle, { color: colors.text }]}>
        How are you feeling today?
      </Text>

      {/* Mood */}
      <Text style={[styles.formLabel, { color: colors.textSecondary }]}>
        Mood
      </Text>
      <View style={styles.moodRow}>
        {MOODS.map((m) => (
          <Pressable
            key={m.value}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setMood(m.value);
              setSaved(false);
            }}
            style={[
              styles.moodBtn,
              {
                backgroundColor:
                  mood === m.value ? m.color : colors.background,
                borderColor:
                  mood === m.value ? m.color : colors.border,
              },
            ]}
          >
            <Feather
              name={m.icon as any}
              size={22}
              color={mood === m.value ? "#fff" : m.color}
            />
            <Text
              style={[
                styles.moodLabel,
                { color: mood === m.value ? "#fff" : colors.textMuted },
              ]}
            >
              {m.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Energy */}
      <Text style={[styles.formLabel, { color: colors.textSecondary }]}>
        Energy Level
      </Text>
      <View style={styles.energyRow}>
        {[1, 2, 3, 4].map((e) => (
          <Pressable
            key={e}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setEnergy(e);
              setSaved(false);
            }}
            style={[
              styles.energyBtn,
              {
                backgroundColor:
                  energy >= e ? colors.tint : colors.background,
                borderColor:
                  energy >= e ? colors.tint : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.energyBtnText,
                { color: energy >= e ? "#fff" : colors.textMuted },
              ]}
            >
              {ENERGY_LABELS[e - 1]}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Notes */}
      <Text style={[styles.formLabel, { color: colors.textSecondary }]}>
        Notes
      </Text>
      <TextInput
        value={notes}
        onChangeText={(t) => {
          setNotes(t);
          setSaved(false);
        }}
        placeholder="How did your meals make you feel? Any cravings?"
        placeholderTextColor={colors.muted}
        multiline
        numberOfLines={3}
        style={[
          styles.notesInput,
          {
            color: colors.text,
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
      />

      <Pressable
        onPress={handleSave}
        style={({ pressed }) => [
          styles.saveBtn,
          {
            backgroundColor: saved ? colors.success : colors.tint,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        {saved ? (
          <Ionicons name="checkmark" size={18} color="#fff" />
        ) : (
          <Feather name="save" size={18} color="#fff" />
        )}
        <Text style={styles.saveBtnText}>
          {saved ? "Saved" : "Save Entry"}
        </Text>
      </Pressable>
    </View>
  );
}

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const colors = Colors.light;
  const { state } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const pastEntries = [...state.journalEntries]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: topPad + 8,
          paddingBottom:
            Platform.OS === "web" ? 34 : insets.bottom + 80,
        },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.screenTitle, { color: colors.text }]}>
        Wellness Journal
      </Text>
      <Text style={[styles.screenSub, { color: colors.textSecondary }]}>
        Track how you feel as your nutrition improves
      </Text>

      <TodayEntryForm />

      {pastEntries.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Past Entries
          </Text>
          {pastEntries.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} />
          ))}
        </>
      )}

      {pastEntries.length === 0 && (
        <View style={styles.historyEmpty}>
          <Feather name="book-open" size={24} color={colors.muted} />
          <Text style={[styles.historyEmptyText, { color: colors.textMuted }]}>
            Your past entries will appear here
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  screenTitle: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 4 },
  screenSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginBottom: 20,
  },
  todayForm: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  todayTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  moodRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 20,
  },
  moodBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 4,
  },
  moodLabel: { fontSize: 9, fontFamily: "Inter_500Medium" },
  energyRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  energyBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  energyBtnText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  notesInput: {
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 14,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: "top",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 14,
    gap: 8,
  },
  saveBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
  },
  entryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  entryDate: { fontSize: 12, fontFamily: "Inter_500Medium" },
  entryMeta: { flexDirection: "row", gap: 6 },
  moodBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  moodBadgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  energyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  energyBadgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  entryNotes: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  historyEmpty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 10,
  },
  historyEmptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
