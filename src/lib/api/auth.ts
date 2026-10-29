/**
 * Authentication and User Profile API Client
 * ফুলপুর ব্লাড ডোনার নেটওয়ার্ক
 */

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: "DONOR" | "ADMIN" | "SUPERADMIN";
  status: "PENDING" | "APPROVED" | "REJECTED" | "BANNED";
  bloodGroup?: string | null;
  presentAddress?: string | null;
  currentAddress?: string | null;
  permanentAddress?: string | null;
  location?: string | null;
  upazila?: string | null;
  gender?: "male" | "female" | "other" | null;
  profileImage?: string | null;
  emailVerifiedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}

export class ApiError extends Error {
  statusCode: number;
  errorCode?: string;
  errorSources?: Array<{ path: string | number; message: string }>;

  constructor(
    message: string,
    statusCode = 500,
    errorCode?: string,
    errorSources?: Array<{ path: string | number; message: string }>
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errorSources = errorSources;
  }
}

const TOKEN_KEY = "phulpur_token";
const USER_KEY = "phulpur_user";

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setStoredAuth = (token: string, user: AuthUser): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("phulpur-auth-change"));
};

export const clearStoredAuth = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("phulpur-auth-change"));
};

const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const token = getStoredToken();

  const headers: Record<string, string> = {};

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Merge custom headers
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err: any) {
    throw new ApiError(
      "সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। অনুগ্রহ করে ইন্টারনেট বা সার্ভার চেক করুন।",
      503
    );
  }

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      (Array.isArray(data?.errorSources) && data.errorSources[0]?.message) ||
      `অনুরোধটি ব্যর্থ হয়েছে (${response.status})`;
    const errorCode = data?.errorCode;
    const errorSources = data?.errorSources;
    throw new ApiError(message, response.status, errorCode, errorSources);
  }

  return (data?.data !== undefined ? data.data : data) as T;
}

export const authApi = {
  // 1. User Login
  async login(payload: {
    identifier?: string;
    phone?: string;
    email?: string;
    password: string;
  }): Promise<LoginResponseData> {
    const data = await apiRequest<LoginResponseData>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (data?.accessToken && data?.user) {
      setStoredAuth(data.accessToken, data.user);
    }
    return data;
  },

  // 2. User Registration (Supports FormData or JSON)
  async register(formDataOrJson: FormData | Record<string, any>): Promise<AuthUser> {
    const body =
      formDataOrJson instanceof FormData
        ? formDataOrJson
        : JSON.stringify(formDataOrJson);

    const user = await apiRequest<AuthUser>("/auth/register", {
      method: "POST",
      body,
    });
    return user;
  },

  // 3. Current Authenticated User
  async getMe(): Promise<AuthUser> {
    const user = await apiRequest<AuthUser>("/auth/me", {
      method: "GET",
    });
    const token = getStoredToken();
    if (token && user) {
      setStoredAuth(token, user);
    }
    return user;
  },

  // 4. Logout
  async logout(): Promise<void> {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });
    } catch {
      // Ignore network failure on logout
    } finally {
      clearStoredAuth();
    }
  },

  // 5. Forgot Password Request
  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // 6. Reset Password with Token
  async resetPassword(payload: {
    token: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // 7. Verify Email with Token
  async verifyEmail(token: string): Promise<{ email: string; emailVerifiedAt: string }> {
    return apiRequest<{ email: string; emailVerifiedAt: string }>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  },

  // 8. Resend Email Verification Link
  async sendEmailVerification(): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/auth/send-email-verification", {
      method: "POST",
    });
  },

  // 9. Change Password (Authenticated)
  async changePassword(payload: {
    oldPassword?: string;
    currentPassword?: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/auth/change-password", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  // 10. Update Email
  async updateEmail(email: string): Promise<AuthUser> {
    const updated = await apiRequest<AuthUser>("/users/me/email", {
      method: "PATCH",
      body: JSON.stringify({ email }),
    });
    const token = getStoredToken();
    if (token && updated) {
      setStoredAuth(token, updated);
    }
    return updated;
  },

  // 11. Update Profile Image
  async updateProfileImage(
    formDataOrPayload: FormData | { profileImage?: string; remove?: boolean }
  ): Promise<AuthUser> {
    const body =
      formDataOrPayload instanceof FormData
        ? formDataOrPayload
        : JSON.stringify(formDataOrPayload);

    const updated = await apiRequest<AuthUser>("/users/me/profile-image", {
      method: "PATCH",
      body,
    });
    const token = getStoredToken();
    if (token && updated) {
      setStoredAuth(token, updated);
    }
    return updated;
  },
};

export const getAssetUrl = (path?: string | null): string => {
  if (!path || !path.trim()) return "/images/donors/tanvir.jpg";
  const cleanPath = path.trim();

  // If already absolute URL (http:// or https://)
  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    return cleanPath;
  }

  // If local Next.js frontend static asset (starts with /images/, etc.)
  if (
    cleanPath.startsWith("/images/") ||
    cleanPath.startsWith("/icons/") ||
    cleanPath === "/file.svg" ||
    cleanPath === "/globe.svg" ||
    cleanPath === "/window.svg" ||
    cleanPath === "/next.svg"
  ) {
    return cleanPath;
  }

  // Backend uploaded file (e.g. /image/..., /uploads/..., /slips/...)
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1").replace("/api/v1", "");
  const normalizedSubPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  return `${baseUrl}${normalizedSubPath}`;
};

