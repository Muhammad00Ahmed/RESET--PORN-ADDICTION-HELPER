import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile } from "./api";

export type MindState = "CLEAR" | "FOGGY" | "RESTLESS" | "STABLE" | "TURBULENT";
export type DisciplineLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "MASTER";
export type Soundscape = "SILENT" | "RAIN" | "DEEP_FOCUS" | "BREATHING" | "CALM";

export interface MicroMission {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
}

interface AppState {
  userId: string | null;
  user: UserProfile | null;
  currentMode: "URGE" | "VULNERABILITY" | "RECOVERY";

  // New features state
  isUrgeMode: boolean;
  cinematicMode: boolean;
  mindState: MindState;
  disciplineLevel: DisciplineLevel;
  currentSoundscape: Soundscape;
  emergencyLockMode: boolean;
  currentMission: MicroMission | null;
  completedMissions: MicroMission[];
  survivedNight: boolean;
  lastNightSurvivalCheck: Date | null;

  setUserId: (id: string) => void;
  setUser: (user: UserProfile) => void;
  setMode: (mode: "URGE" | "VULNERABILITY" | "RECOVERY") => void;
  updateStreak: (streak: number, disciplineScore: number) => void;
  clearUser: () => void;

  // New feature actions
  activateUrgeMode: () => void;
  deactivateUrgeMode: () => void;
  setCinematicMode: (active: boolean) => void;
  updateMindState: (state: MindState) => void;
  updateDisciplineLevel: (level: DisciplineLevel) => void;
  setSoundscape: (soundscape: Soundscape) => void;
  activateEmergencyLock: () => void;
  deactivateEmergencyLock: () => void;
  setCurrentMission: (mission: MicroMission | null) => void;
  completeMission: (missionId: string) => void;
  checkNightSurvival: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userId: null,
      user: null,
      currentMode: "RECOVERY",

      // Initialize new features
      isUrgeMode: false,
      cinematicMode: false,
      mindState: "STABLE",
      disciplineLevel: "BEGINNER",
      currentSoundscape: "SILENT",
      emergencyLockMode: false,
      currentMission: null,
      completedMissions: [],
      survivedNight: false,
      lastNightSurvivalCheck: null,

      setUserId: (id) => set({ userId: id }),
      setUser: (user) => set({ user }),
      setMode: (mode) => set({ currentMode: mode }),
      updateStreak: (streak, disciplineScore) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, streak, disciplineScore }
            : null,
        })),
      clearUser: () => set({ userId: null, user: null }),

      // New feature implementations
      activateUrgeMode: () => set({ isUrgeMode: true, cinematicMode: true }),
      deactivateUrgeMode: () => set({ isUrgeMode: false, cinematicMode: false }),
      setCinematicMode: (active) => set({ cinematicMode: active }),
      updateMindState: (state) => set({ mindState: state }),
      updateDisciplineLevel: (level) => set({ disciplineLevel: level }),
      setSoundscape: (soundscape) => set({ currentSoundscape: soundscape }),
      activateEmergencyLock: () => set({ emergencyLockMode: true }),
      deactivateEmergencyLock: () => set({ emergencyLockMode: false }),
      setCurrentMission: (mission) => set({ currentMission: mission }),
      completeMission: (missionId) => {
        const state = get();
        const mission = state.currentMission;
        if (mission && mission.id === missionId) {
          const completedMission = { ...mission, completed: true, completedAt: new Date() };
          set({
            currentMission: null,
            completedMissions: [...state.completedMissions, completedMission]
          });
        }
      },
      checkNightSurvival: () => {
        const now = new Date();
        const hour = now.getHours();
        const state = get();

        // Check if it's morning and we survived the night
        if (hour >= 6 && hour <= 10 && !state.survivedNight) {
          const lastCheck = state.lastNightSurvivalCheck;
          if (!lastCheck || (now.getTime() - lastCheck.getTime()) > 24 * 60 * 60 * 1000) {
            set({ survivedNight: true, lastNightSurvivalCheck: now });
          }
        } else if (hour < 6 || hour > 22) {
          // Reset for next night
          set({ survivedNight: false });
        }
      },
    }),
    {
      name: "reset-store",
      partialize: (state) => ({
        userId: state.userId,
        mindState: state.mindState,
        disciplineLevel: state.disciplineLevel,
        currentSoundscape: state.currentSoundscape,
        completedMissions: state.completedMissions,
        survivedNight: state.survivedNight,
        lastNightSurvivalCheck: state.lastNightSurvivalCheck,
      }),
    }
  )
);
