import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

export default function SyncScreen() {
  const insets = useSafeAreaInsets();
  const colors = Colors.light;
  const { syncAvailable, syncCode, syncStatus, enableSync, joinSync, disableSync } = useApp();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const busy = syncStatus === "syncing";

  const join = async () => {
    const result = await joinSync(code);
    if (result === "ok") {
      setCode("");
      setMessage("Connected. This device now has your synced data.");
    } else if (result === "invalid") setMessage("That code doesn't look right. Check it and try again.");
    else if (result === "not-found") setMessage("No data found for that code.");
    else setMessage("Couldn't reach the server. Try again.");
  };

  const confirmJoin = () => {
    const text = "This replaces the data on this device with the synced copy.";
    if (Platform.OS === "web") {
      if (window.confirm(text)) join();
    } else {
      Alert.alert("Replace data on this device?", text, [
        { text: "Cancel", style: "cancel" },
        { text: "Replace", style: "destructive", onPress: join },
      ]);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingTop: (Platform.OS === "web" ? 24 : insets.top) + 12 }]}
    >
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Feather name="chevron-left" size={22} color={colors.text} />
        <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
      </Pressable>
      <Text style={[styles.title, { color: colors.text }]}>Sync across devices</Text>

      {!syncAvailable ? (
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          Sync isn't set up for this build. Set EXPO_PUBLIC_API_URL to your API server and rebuild.
        </Text>
      ) : syncCode ? (
        <View style={[styles.card, { backgroundColor: colors.backgroundCard }]}>
          <Text style={[styles.label, { color: colors.textMuted }]}>Your sync code</Text>
          <Text selectable style={[styles.code, { color: colors.tint }]}>{syncCode}</Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            Enter this code on another device to load your data there. Anyone with the code can read and change your data, so keep it private.
          </Text>
          <Text style={[styles.status, { color: syncStatus === "error" ? colors.error : colors.textMuted }]}>
            {syncStatus === "syncing" ? "Syncing…" : syncStatus === "error" ? "Couldn't sync. Changes will retry." : "Up to date"}
          </Text>
          <Pressable onPress={disableSync} style={[styles.secondary, { borderColor: colors.border }]}>
            <Text style={[styles.secondaryText, { color: colors.error }]}>Stop syncing on this device</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={[styles.card, { backgroundColor: colors.backgroundCard }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Start syncing</Text>
            <Text style={[styles.body, { color: colors.textSecondary }]}>
              Creates a private code and uploads this device's data.
            </Text>
            <Pressable disabled={busy} onPress={enableSync} style={[styles.primary, { backgroundColor: colors.tint, opacity: busy ? 0.6 : 1 }]}>
              <Text style={styles.primaryText}>{busy ? "Working…" : "Create sync code"}</Text>
            </Pressable>
          </View>
          <View style={[styles.card, { backgroundColor: colors.backgroundCard }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Already have a code?</Text>
            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="Paste your sync code"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            />
            <Pressable disabled={busy || !code.trim()} onPress={confirmJoin} style={[styles.primary, { backgroundColor: colors.tint, opacity: busy || !code.trim() ? 0.5 : 1 }]}>
              <Text style={styles.primaryText}>Connect this device</Text>
            </Pressable>
          </View>
        </>
      )}
      {syncStatus === "error" && !syncCode && (
        <Text style={[styles.body, { color: colors.error }]}>Couldn't reach the sync server. Try again.</Text>
      )}
      {message && <Text style={[styles.body, { color: colors.textSecondary }]}>{message}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 48, gap: 16 },
  back: { flexDirection: "row", alignItems: "center", gap: 2 },
  backText: { fontFamily: "Inter_500Medium", fontSize: 15 },
  title: { fontFamily: "Inter_700Bold", fontSize: 26 },
  card: { borderRadius: 16, padding: 18, gap: 12 },
  cardTitle: { fontFamily: "Inter_600SemiBold", fontSize: 17 },
  label: { fontFamily: "Inter_500Medium", fontSize: 13 },
  code: { fontFamily: "Inter_700Bold", fontSize: 20, letterSpacing: 1 },
  body: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20 },
  status: { fontFamily: "Inter_500Medium", fontSize: 13 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontFamily: "Inter_400Regular", fontSize: 15 },
  primary: { borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  primaryText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 15 },
  secondary: { borderWidth: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  secondaryText: { fontFamily: "Inter_500Medium", fontSize: 14 },
});
