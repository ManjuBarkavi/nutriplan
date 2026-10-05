import { ApiError, getSyncState, putSyncState, setBaseUrl } from "@workspace/api-client-react";
import * as Crypto from "expo-crypto";

import type { AppState } from "@/constants/nutrients";

// Base URL of the deployed API server (no trailing /api). Sync stays hidden when it is not set.
const API_URL = process.env.EXPO_PUBLIC_API_URL;
if (API_URL) setBaseUrl(API_URL);

export const SYNC_AVAILABLE = !!API_URL;

const CODE_PATTERN = /^[A-Za-z0-9_-]{16,64}$/;
const ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";

export function isValidSyncCode(code: string) {
  return CODE_PATTERN.test(code);
}

// 24 random characters from a 32-symbol alphabet (120 bits); the code is the only secret protecting the data.
export function generateSyncCode() {
  const bytes = Crypto.getRandomBytes(24);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

export type RemoteState = { state: AppState; updatedAt: string } | null;

export async function pullState(code: string): Promise<RemoteState> {
  try {
    const res = await getSyncState(code);
    return { state: res.state as unknown as AppState, updatedAt: res.updatedAt };
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function pushState(code: string, state: AppState): Promise<string> {
  const res = await putSyncState(code, { state: state as unknown as Record<string, unknown> });
  return res.updatedAt;
}
