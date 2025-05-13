import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "./supabase/client";

// Define the store state interface
interface UserStore {
  userId: string | null;
  setUserId: (id: string) => void;
  clearUserId: () => void;
  userEmail: string | null;
  setUserEmail: (email: string) => void;
  clearUserEmail: (email: string) => void;
}

// Create the store with persistence
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userId: null,
      setUserId: (id) => set({ userId: id }),
      clearUserId: () => set({ userId: null }),
      userEmail: null,
      setUserEmail: (email) => set({ userEmail: email }),
      clearUserEmail: () => set({ userEmail: null }),
    }),
    {
      name: "user-storage", // unique name for localStorage
      partialize: (state) => ({ userId: state.userId }), // only persist userId
    },
  ),
);

export interface Group {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  created_by?: string;
  member_count?: number;
}

// Define the groups store state
interface GroupsStore {
  groups: Group[];
  isLoading: boolean;
  error: string | null;
  fetchGroups: (userId: string) => Promise<void>;
  clearGroups: () => void;
}

// Create the groups store
export const useGroupsStore = create<GroupsStore>((set, get) => ({
  groups: [],
  isLoading: false,
  error: null,

  fetchGroups: async (userId: string) => {
    if (!userId) return;

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/groups?user_id=${userId}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch groups");

      // Transform the joined data to a flat structure
      const groups = data.data.map((membership: any) => ({
        id: membership.groups.id,
        name: membership.groups.name,
        description: membership.groups.description,
        created_at: membership.groups.created_at,
        created_by: membership.groups.created_by,
      }));

      set({ groups, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearGroups: () => set({ groups: [], error: null }),
}));
