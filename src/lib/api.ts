export const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8080/api/v1";

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      ...init,
    });
    const isJson = (res.headers.get("content-type") || "").includes("application/json");
    const body = isJson ? await res.json() : await res.text();
    if (!res.ok) {
      const msg = typeof body === "string" ? body : body?.message || body?.error || res.statusText;
      return { ok: false, error: msg } as const;
    }
    return { ok: true, data: body as T } as const;
  } catch (e: any) {
    return { ok: false, error: e?.message || "Network error" } as const;
  }
}

export function authHeader(): Record<string, string> {
  const token = localStorage.getItem("token");
  console.log("🔑 Getting auth header, token exists:", !!token);
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    console.log("🔑 Auth header:", headers);
  } else {
    console.log("🔑 No token found");
  }
  
  return headers;
}

interface BackendProfile {
  email: string;
  name: string | null;
  dietary_preference: string | null;
  gender: string | null;
  age: number | null;
  bio: string | null;
  avatar: string | null;
}

export async function getProfile() {
  console.log("🔍 getProfile called");
  const result = await apiFetch<BackendProfile>("/users/me", {
    headers: authHeader(),
  });
  console.log("📡 getProfile response:", result);
  return result;
}

export async function updateProfile(profile: any) {
  console.log("🔄 updateProfile called with:", profile);

  // Convert camelCase to snake_case for backend
  const backendProfile = {
    name: profile.name,
    dietary_preference: profile.dietaryPreference,
    gender: profile.gender,
    age: profile.age,
    bio: profile.bio,
  };

  console.log("🔄 Converted to backend format:", backendProfile);

  const result = await apiFetch<any>("/users/me", {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify(backendProfile),
  });
  console.log("📡 updateProfile response:", result);
  return result;
}

export async function logout() {
  // Panggil endpoint logout di backend, abaikan jika gagal
  await apiFetch("/auth/logout", {
    method: 'POST',
    headers: authHeader(),
  });

  // Bersihkan data lokal
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
  } catch {}
}

// --- Body Measurements --- //

interface BackendMeasurements {
  height: number | null;
  current_weight: number | null;
  target_weight: number | null;
  waist: number | null;
  chest: number | null;
  thigh: number | null;
  arm: number | null;
}

export async function getMeasurements() {
  console.log("🔍 getMeasurements called");
  const result = await apiFetch<BackendMeasurements>("/users/me/measurements", {
    headers: authHeader(),
  });
  console.log("📡 getMeasurements response:", result);
  return result;
}

export async function updateMeasurements(measurements: any) {
  console.log("🔄 updateMeasurements called with:", measurements);
  
  // Convert camelCase to snake_case for backend
  const backendMeasurements = {
    height: measurements.height,
    current_weight: measurements.currentWeight,
    target_weight: measurements.targetWeight,
    waist: measurements.waist,
    chest: measurements.chest,
    thigh: measurements.thigh,
    arm: measurements.arm,
  };
  
  console.log("🔄 Converted to backend format:", backendMeasurements);
  
  const result = await apiFetch<any>("/users/me/measurements", {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify(backendMeasurements),
  });
  console.log("📡 updateMeasurements response:", result);
  return result;
}
