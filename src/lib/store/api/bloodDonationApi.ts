import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAssetUrl, getStoredToken } from "@/lib/api/auth";
import { DonationRecord } from "@/lib/data/donorDonations";
import { formatBengaliDate } from "@/lib/utils/donorCountdown";

export interface Donor {
  id: string;
  name: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  location: string;
  phone: string;
  lastDonationDate: string;
  daysRemaining: number;
  avatarUrl: string;
  gender: "male" | "female" | "other";
  available: boolean;
}

export interface Stats {
  totalDonors: number;
  totalDonations: number;
  lastDonationDaysAgo: number;
}

export interface EmergencyRequest {
  id: string;
  rugirNam: string;
  bloodGroup: string;
  kotoBag: number;
  thikana: string;
  phone: string;
  title?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MyDonationsData {
  countdown?: {
    canDonateNow?: boolean;
    daysRemaining?: number;
    daysSinceLastDonation?: number | null;
    status?: string;
    targetDate?: string;
    latestApprovedDate?: string;
    lastDonationDate?: string;
    hasApprovedDonation?: boolean;
    displayStatus?: string;
    message?: string;
  };
  submissionCooldown?: {
    canSubmitNewRecord: boolean;
    daysRemaining: number;
    daysSinceLast?: number | null;
    lastDonationDate?: string | null;
    nextEligibleDate?: string | null;
    lastStatus?: string | null;
  };
  summary?: {
    totalDonations: number;
    approvedDonations: number;
    pendingDonations: number;
    rejectedDonations: number;
  };
  donations: DonationRecord[];
}

export interface AdminOverviewStats {
  totalDonors: number;
  approvedDonors: number;
  pendingDonors: number;
  blockedDonors: number;
  thisMonthDonors: number;
  totalDonations: number;
  approvedDonations: number;
  pendingDonations: number;
  activeEmergencyRequests: number;
  pendingReports: number;
}

export interface AdminBloodDistribution {
  type: string;
  count: number;
  countText: string;
  percentage: string;
  percentageNum: number;
  isRare: boolean;
}

export interface AdminPendingApprovalItem {
  id: string;
  recordId: string;
  donorId: string;
  donorName: string;
  donorPhone: string;
  donorAvatar?: string;
  bloodGroup: string;
  hospital: string;
  donationDate: string;
  slipUrl?: string;
  slipNumber?: string;
  rugirDhoron?: string;
  createdAt: string;
}

export interface AdminRecentDonorItem {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  bloodGroup: string;
  area: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  isBlocked: boolean;
  createdAt: string;
}

export interface AdminOverviewResponse {
  stats: AdminOverviewStats;
  bloodTypeDistribution: AdminBloodDistribution[];
  pendingApprovals: AdminPendingApprovalItem[];
  recentDonors: AdminRecentDonorItem[];
}

export interface AdminDonorItem {
  id: string;
  name: string;
  phone: string;
  email?: string;
  bloodGroup: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  isBlocked: boolean;
  role: string;
  gender?: string;
  currentAddress?: string;
  permanentAddress?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  bloodGroupDetails?: {
    symbol: string;
    bengali: string;
    english: string;
    canDonateTo: string[];
    canReceiveFrom: string[];
    isRare: boolean;
  };
  totalDonations?: number;
  lastDonationDate?: string | null;
}

export interface AdminDonorsFilter {
  status?: string;
  isBlocked?: boolean;
  bloodGroup?: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface AdminDonorsResponse {
  data: AdminDonorItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface AdminDonationItem {
  id: string;
  donorId: string;
  donationDate: string;
  donationAddress: string;
  rugirDhoron?: string;
  donationSlipNumber?: string;
  slipUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  verifiedAt?: string | null;
  verifiedById?: string | null;
  createdAt: string;
  updatedAt: string;
  donor: {
    id: string;
    name: string;
    phone: string;
    bloodGroup: string;
    profileImage?: string;
    currentAddress?: string;
  };
  verifiedBy?: {
    id: string;
    name: string;
    role: string;
  } | null;
}

export interface AdminDonationsResponse {
  data: AdminDonationItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface AdminReportItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "NEW" | "READ" | "RESOLVED";
  createdAt: string;
  updatedAt: string;
}

export interface AdminReportsResponse {
  data: AdminReportItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    counts: {
      total: number;
      new: number;
      read: number;
      resolved: number;
    };
  };
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

export const bloodDonationApi = createApi({
  reducerPath: "bloodDonationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = getStoredToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Donors",
    "Stats",
    "MyDonations",
    "EmergencyRequests",
    "AdminOverview",
    "AdminDonors",
    "AdminDonations",
    "AdminReports",
  ],
  endpoints: (builder) => ({
    getDonors: builder.query<
      Donor[],
      {
        bloodGroup?: string;
        location?: string;
        searchQuery?: string;
        onlyAvailable?: boolean;
        limit?: number;
        page?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc" | string;
      } | void
    >({
      async queryFn(filter, _api, _extraOptions, fetchWithBQ) {
        try {
          const params = new URLSearchParams();
          if (filter?.sortBy) {
            params.append("sortBy", filter.sortBy);
          }
          if (filter?.sortOrder) {
            params.append("sortOrder", filter.sortOrder);
          }
          if (filter?.limit) {
            params.append("limit", String(filter.limit));
          }
          if (filter?.page) {
            params.append("page", String(filter.page));
          }
          if (
            filter?.bloodGroup &&
            filter.bloodGroup !== "সব গ্রুপ" &&
            filter.bloodGroup !== "all"
          ) {
            params.append("bloodGroup", filter.bloodGroup);
          }
          if (filter?.searchQuery && filter.searchQuery.trim() !== "") {
            params.append("searchQuery", filter.searchQuery.trim());
            params.append("searchTerm", filter.searchQuery.trim());
          }
          if (filter?.location && filter.location.trim() !== "") {
            params.append("location", filter.location.trim());
          }
          if (filter?.onlyAvailable) {
            params.append("onlyAvailable", "true");
            params.append("isAvailable", "true");
          }

          const queryString = params.toString() ? `?${params.toString()}` : "";
          const result = await fetchWithBQ(`/donors${queryString}`);

          if (result.error) {
            return { data: [] };
          }

          const resp = result.data as any;
          const donorList = Array.isArray(resp.data)
            ? resp.data
            : Array.isArray(resp)
            ? resp
            : [];

          const mapped: Donor[] = donorList.map((d: any) => ({
            id: d.id,
            name: d.name,
            bloodGroup: d.bloodGroup,
            location: d.currentAddress || d.permanentAddress || "ফুলপুর",
            phone: d.phone,
            lastDonationDate: d.lastDonationDate
              ? formatBengaliDate(new Date(d.lastDonationDate))
              : "এখনও রক্তদান করেননি",
            daysRemaining: d.daysRemaining ?? d.countdown?.daysRemaining ?? 0,
            avatarUrl: getAssetUrl(d.profileImage || d.avatarUrl || d.avatar) || "/images/donors/default.jpg",
            gender: d.gender || "male",
            available:
              d.available !== undefined
                ? Boolean(d.available)
                : (d.status ? d.status === "APPROVED" : true) && (d.countdown?.canDonateNow ?? true),
          }));

          return { data: mapped };
        } catch {
          return { data: [] };
        }
      },
      providesTags: ["Donors"],
    }),

    getStats: builder.query<Stats, void>({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        try {
          const result = await fetchWithBQ("/stats");
          if (result.error) {
            return {
              data: {
                totalDonors: 0,
                totalDonations: 0,
                lastDonationDaysAgo: 0,
              },
            };
          }
          const resp = result.data as any;
          const data = resp.data || resp;
          return {
            data: {
              totalDonors: data.totalDonors ?? 0,
              totalDonations: data.totalDonations ?? 0,
              lastDonationDaysAgo: data.lastDonationDaysAgo ?? 0,
            },
          };
        } catch {
          return {
            data: {
              totalDonors: 0,
              totalDonations: 0,
              lastDonationDaysAgo: 0,
            },
          };
        }
      },
      providesTags: ["Stats"],
    }),

    getMyDonations: builder.query<MyDonationsData, void>({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        try {
          const result = await fetchWithBQ("/donations/me");
          if (result.data) {
            const resp = result.data as any;
            const data = resp.data || resp;
            const records = Array.isArray(data.records)
              ? data.records
              : Array.isArray(data.donations)
              ? data.donations
              : [];

            const formattedRecords: DonationRecord[] = records.map((r: any) => ({
              id: r.id,
              date: formatBengaliDate(new Date(r.donationDate)),
              isoDate: r.donationDate,
              time: "সকাল ১০:০০ মি.",
              hospital: r.donationAddress || "হাসপাতাল",
              area: "ফুলপুর",
              caseNote: r.rugirDhoron || "স্বেচ্ছায় রক্তদান",
              quantity: `${r.units || 1} ব্যাগ`,
              status:
                r.status === "APPROVED"
                  ? "অনুমোদিত"
                  : r.status === "PENDING"
                  ? "যাচাই প্রক্রিয়াধীন"
                  : "বাতিল",
              statusType:
                r.status === "APPROVED"
                  ? "approved"
                  : r.status === "PENDING"
                  ? "pending"
                  : "rejected",
              slipUrl: r.slipUrl,
              voucherNumber: r.donationSlipNumber,
            }));

            const approvedCount =
              data.summary?.approvedDonations ??
              formattedRecords.filter((d) => d.statusType === "approved").length;

            return {
              data: {
                countdown: data.countdown || {
                  canDonateNow: true,
                  daysRemaining: 0,
                  status: "no_approved",
                  daysSinceLastDonation: null,
                },
                submissionCooldown: data.submissionCooldown || {
                  canSubmitNewRecord: true,
                  daysRemaining: 0,
                  daysSinceLast: null,
                  lastDonationDate: null,
                  nextEligibleDate: null,
                  lastStatus: null,
                },
                summary: {
                  totalDonations:
                    data.summary?.totalDonations ?? formattedRecords.length,
                  approvedDonations: approvedCount,
                  pendingDonations:
                    data.summary?.pendingDonations ??
                    formattedRecords.filter((d) => d.statusType === "pending")
                      .length,
                  rejectedDonations:
                    data.summary?.rejectedDonations ??
                    formattedRecords.filter((d) => d.statusType === "rejected")
                      .length,
                },
                donations: formattedRecords,
              },
            };
          }
        } catch {
          // Unauthenticated or network error
        }

        return {
          data: {
            countdown: {
              canDonateNow: true,
              daysRemaining: 0,
              status: "no_approved",
              daysSinceLastDonation: null,
            },
            submissionCooldown: {
              canSubmitNewRecord: true,
              daysRemaining: 0,
              daysSinceLast: null,
              lastDonationDate: null,
              nextEligibleDate: null,
              lastStatus: null,
            },
            summary: {
              totalDonations: 0,
              approvedDonations: 0,
              pendingDonations: 0,
              rejectedDonations: 0,
            },
            donations: [],
          },
        };
      },
      providesTags: ["MyDonations"],
    }),

    createDonation: builder.mutation<
      any,
      | FormData
      | {
          donationDate: string;
          donationAddress: string;
          rugirDhoron?: string;
          donationSlipNumber?: string;
          slipUrl?: string;
        }
    >({
      async queryFn(payload, _api, _extraOptions, fetchWithBQ) {
        try {
          const body =
            payload instanceof FormData ? payload : JSON.stringify(payload);
          const headers: Record<string, string> = {};
          if (!(payload instanceof FormData)) {
            headers["Content-Type"] = "application/json";
          }

          const result = await fetchWithBQ({
            url: "/donations",
            method: "POST",
            body,
            headers,
          });

          if (result.error) {
            return { error: result.error };
          }
          return { data: (result.data as any)?.data || result.data };
        } catch (err: any) {
          return {
            error: {
              status: 500,
              data: err?.message || "Failed to submit donation record",
            },
          };
        }
      },
      invalidatesTags: ["MyDonations", "Stats", "Donors"],
    }),

    getEmergencyRequests: builder.query<
      EmergencyRequest[],
      { bloodGroup?: string; status?: string } | void
    >({
      async queryFn(filter, _api, _extraOptions, fetchWithBQ) {
        try {
          const params = new URLSearchParams();
          params.append("status", filter?.status || "ACTIVE");
          if (
            filter?.bloodGroup &&
            filter.bloodGroup !== "সব গ্রুপ" &&
            filter.bloodGroup !== "all"
          ) {
            params.append("bloodGroup", filter.bloodGroup);
          }
          const queryString = params.toString() ? `?${params.toString()}` : "";
          const result = await fetchWithBQ(`/emergency-requests${queryString}`);

          if (result.data) {
            const resp = result.data as any;
            const requests = Array.isArray(resp.data) ? resp.data : [];
            return { data: requests };
          }
        } catch {
          // Empty state
        }
        return { data: [] };
      },
      providesTags: ["EmergencyRequests"],
    }),

    updateDonorProfile: builder.mutation<any, any>({
      async queryFn(payload, _api, _extraOptions, fetchWithBQ) {
        try {
          const body =
            payload instanceof FormData ? payload : JSON.stringify(payload);
          const headers: Record<string, string> = {};
          if (!(payload instanceof FormData)) {
            headers["Content-Type"] = "application/json";
          }

          const result = await fetchWithBQ({
            url: "/donors/me",
            method: "PATCH",
            body,
            headers,
          });

          if (result.error) {
            return { error: result.error };
          }
          return { data: (result.data as any)?.data || result.data };
        } catch (err: any) {
          return {
            error: {
              status: 500,
              data: err?.message || "Failed to update profile",
            },
          };
        }
      },
      invalidatesTags: ["MyDonations", "Donors"],
    }),

    registerDonor: builder.mutation<any, any>({
      async queryFn(payload, _api, _extraOptions, fetchWithBQ) {
        try {
          const result = await fetchWithBQ({
            url: "/donors",
            method: "POST",
            body: payload,
          });
          if (result.error) {
            return { error: result.error };
          }
          return { data: (result.data as any)?.data || result.data };
        } catch (err: any) {
          return {
            error: {
              status: 500,
              data: err?.message || "Failed to register donor",
            },
          };
        }
      },
      invalidatesTags: ["Donors", "Stats"],
    }),

    getPlatformContact: builder.query<
      {
        id: string;
        phone: string;
        email: string;
        whatsapp: string;
        facebook?: string;
      },
      void
    >({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        try {
          const result = await fetchWithBQ("/platform-contact");
          if (result.data) {
            const resp = result.data as any;
            const data = resp.data || resp;
            return {
              data: {
                id: data.id || "1",
                phone: data.phone || "০১৯৭২-৬০৬২৫৫",
                email: data.email || "bonnochobi@gmail.com",
                whatsapp: data.whatsapp || "+8801972606255",
                facebook: "https://www.facebook.com/PhulpurBloodDonorNetwork",
              },
            };
          }
        } catch {
          // graceful fallback
        }
        return {
          data: {
            id: "1",
            phone: "০১৯৭২-৬০৬২৫৫",
            email: "bonnochobi@gmail.com",
            whatsapp: "+8801972606255",
            facebook: "https://www.facebook.com/PhulpurBloodDonorNetwork",
          },
        };
      },
    }),

    sendContactMessage: builder.mutation<
      any,
      {
        name: string;
        email: string;
        phone?: string;
        subject: string;
        message: string;
      }
    >({
      async queryFn(payload, _api, _extraOptions, fetchWithBQ) {
        try {
          const result = await fetchWithBQ({
            url: "/contact",
            method: "POST",
            body: payload,
          });
          if (result.error) {
            return { error: result.error };
          }
          return { data: (result.data as any)?.data || result.data };
        } catch (err: any) {
          return {
            error: {
              status: 500,
              data: err?.message || "বার্তা পাঠাতে ব্যর্থ হয়েছে",
            },
          };
        }
      },
    }),

    // Admin API Endpoints
    getAdminOverview: builder.query<AdminOverviewResponse, void>({
      query: () => "/admin/overview",
      transformResponse: (response: { success: boolean; data: AdminOverviewResponse }) => response.data,
      providesTags: ["AdminOverview"],
    }),

    getAdminDonors: builder.query<AdminDonorsResponse, AdminDonorsFilter | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.searchQuery) params.append("searchQuery", filters.searchQuery);
        if (filters?.bloodGroup && filters.bloodGroup !== "all") params.append("bloodGroup", filters.bloodGroup);
        if (filters?.status && filters.status !== "all") params.append("status", filters.status);
        if (filters?.isBlocked !== undefined) params.append("isBlocked", String(filters.isBlocked));
        if (filters?.page) params.append("page", String(filters.page));
        if (filters?.limit) params.append("limit", String(filters.limit));
        if (filters?.sortBy) params.append("sortBy", filters.sortBy);
        if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
        const qs = params.toString();
        return `/admin/donors${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (response: { success: boolean; data: AdminDonorItem[]; pagination: any }) => ({
        data: response.data || [],
        pagination: response.pagination || { page: 1, limit: 10, total: 0, totalPage: 1 },
      }),
      providesTags: ["AdminDonors"],
    }),

    getAdminDonations: builder.query<
      AdminDonationsResponse,
      { status?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: string } | void
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.status && filters.status !== "all") params.append("status", filters.status);
        if (filters?.page) params.append("page", String(filters.page));
        if (filters?.limit) params.append("limit", String(filters.limit));
        if (filters?.sortBy) params.append("sortBy", filters.sortBy);
        if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
        const qs = params.toString();
        return `/admin/donations${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (response: { success: boolean; data: AdminDonationItem[]; pagination: any }) => ({
        data: response.data || [],
        pagination: response.pagination || { page: 1, limit: 10, total: 0, totalPage: 1 },
      }),
      providesTags: ["AdminDonations"],
    }),

    getAdminReports: builder.query<
      AdminReportsResponse,
      { status?: string; page?: number; limit?: number } | void
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.status && filters.status !== "all") params.append("status", filters.status);
        if (filters?.page) params.append("page", String(filters.page));
        if (filters?.limit) params.append("limit", String(filters.limit));
        const qs = params.toString();
        return `/contact${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (response: { success: boolean; data: AdminReportItem[]; pagination: any }) => ({
        data: response.data || [],
        pagination: response.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPage: 1,
          counts: { total: 0, new: 0, read: 0, resolved: 0 },
        },
      }),
      providesTags: ["AdminReports"],
    }),

    approveDonor: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/donors/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["AdminDonors", "AdminOverview", "Donors", "Stats"],
    }),

    rejectDonor: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/donors/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["AdminDonors", "AdminOverview", "Donors", "Stats"],
    }),

    blockDonor: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/donors/${id}/block`,
        method: "PATCH",
      }),
      invalidatesTags: ["AdminDonors", "AdminOverview", "Donors", "Stats"],
    }),

    unblockDonor: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/donors/${id}/unblock`,
        method: "PATCH",
      }),
      invalidatesTags: ["AdminDonors", "AdminOverview", "Donors", "Stats"],
    }),

    deleteDonor: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/donors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        "AdminDonors",
        "AdminOverview",
        "Donors",
        "Stats",
        "AdminDonations",
        "AdminReports",
      ],
    }),

    approveDonation: builder.mutation<any, { id: string; adminNote?: string }>({
      query: ({ id, adminNote }) => ({
        url: `/admin/donations/${id}/approve`,
        method: "PATCH",
        body: { adminNote },
      }),
      invalidatesTags: ["AdminDonations", "AdminOverview", "Stats", "MyDonations", "Donors"],
    }),

    rejectDonation: builder.mutation<any, { id: string; rejectionReason?: string }>({
      query: ({ id, rejectionReason }) => ({
        url: `/admin/donations/${id}/reject`,
        method: "PATCH",
        body: { rejectionReason },
      }),
      invalidatesTags: ["AdminDonations", "AdminOverview", "Stats", "MyDonations"],
    }),

    updateReportStatus: builder.mutation<any, { id: string; status: "NEW" | "READ" | "RESOLVED" }>({
      query: ({ id, status }) => ({
        url: `/contact/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["AdminReports", "AdminOverview"],
    }),

    deleteReport: builder.mutation<any, string>({
      query: (id) => ({
        url: `/contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminReports", "AdminOverview"],
    }),
  }),
});

export const {
  useGetDonorsQuery,
  useGetStatsQuery,
  useGetMyDonationsQuery,
  useCreateDonationMutation,
  useGetEmergencyRequestsQuery,
  useUpdateDonorProfileMutation,
  useRegisterDonorMutation,
  useGetPlatformContactQuery,
  useSendContactMessageMutation,
  // Admin hooks
  useGetAdminOverviewQuery,
  useGetAdminDonorsQuery,
  useGetAdminDonationsQuery,
  useGetAdminReportsQuery,
  useApproveDonorMutation,
  useRejectDonorMutation,
  useBlockDonorMutation,
  useUnblockDonorMutation,
  useDeleteDonorMutation,
  useApproveDonationMutation,
  useRejectDonationMutation,
  useUpdateReportStatusMutation,
  useDeleteReportMutation,
} = bloodDonationApi;

