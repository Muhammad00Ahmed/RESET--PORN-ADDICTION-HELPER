import { MindState, DisciplineLevel } from "./store";

export interface MicroMission {
  id: string;
  title: string;
  description: string;
  type: "DAILY" | "ACHIEVEMENT" | "STREAK";
  reward: number;
  completed: boolean;
}

export const MICRO_MISSIONS: MicroMission[] = [
  {
    id: "morning_routine",
    title: "Morning Routine",
    description: "Complete your morning routine without checking social media first",
    type: "DAILY",
    reward: 10,
    completed: false,
  },
  {
    id: "deep_breath",
    title: "Deep Breath",
    description: "Take 10 deep breaths when you feel the urge rising",
    type: "DAILY",
    reward: 5,
    completed: false,
  },
  {
    id: "gratitude_note",
    title: "Gratitude Note",
    description: "Write down one thing you're grateful for today",
    type: "DAILY",
    reward: 8,
    completed: false,
  },
  {
    id: "no_phone_bed",
    title: "No Phone in Bed",
    description: "Keep your phone out of reach while in bed",
    type: "DAILY",
    reward: 12,
    completed: false,
  },
  {
    id: "exercise_10min",
    title: "10-Minute Exercise",
    description: "Do any form of exercise for at least 10 minutes",
    type: "DAILY",
    reward: 15,
    completed: false,
  },
  {
    id: "healthy_meal",
    title: "Healthy Meal",
    description: "Prepare and eat a nutritious meal",
    type: "DAILY",
    reward: 10,
    completed: false,
  },
  {
    id: "meditation_5min",
    title: "5-Minute Meditation",
    description: "Meditate for at least 5 minutes",
    type: "DAILY",
    reward: 8,
    completed: false,
  },
  {
    id: "water_intake",
    title: "Stay Hydrated",
    description: "Drink at least 8 glasses of water today",
    type: "DAILY",
    reward: 6,
    completed: false,
  },
  {
    id: "streak_3days",
    title: "3-Day Streak",
    description: "Maintain a 3-day streak without urges",
    type: "STREAK",
    reward: 25,
    completed: false,
  },
  {
    id: "streak_7days",
    title: "Week Warrior",
    description: "Complete a full 7-day streak",
    type: "STREAK",
    reward: 50,
    completed: false,
  },
  {
    id: "urge_resisted_10",
    title: "Urge Resister",
    description: "Successfully resist 10 urges in total",
    type: "ACHIEVEMENT",
    reward: 30,
    completed: false,
  },
  {
    id: "mindful_moment",
    title: "Mindful Moment",
    description: "Take a mindful moment to observe your thoughts without judgment",
    type: "DAILY",
    reward: 7,
    completed: false,
  },
];

export function getRandomMission(completedIds: string[]): MicroMission | null {
  const availableMissions = MICRO_MISSIONS.filter(
    mission => !completedIds.includes(mission.id)
  );

  if (availableMissions.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableMissions.length);
  return availableMissions[randomIndex];
}

export function getMindStateDescription(state: MindState): string {
  switch (state) {
    case "CLEAR":
      return "Clear skies ahead";
    case "FOGGY":
      return "Mental fog present";
    case "RESTLESS":
      return "Restless energy";
    case "STABLE":
      return "Stable and focused";
    case "TURBULENT":
      return "Turbulent thoughts";
    default:
      return "Monitoring mental state";
  }
}

export function getDisciplineLevelDescription(level: DisciplineLevel): string {
  switch (level) {
    case "BEGINNER":
      return "Building foundation";
    case "INTERMEDIATE":
      return "Growing stronger";
    case "ADVANCED":
      return "Highly disciplined";
    case "MASTER":
      return "Master of control";
    default:
      return "Developing discipline";
  }
}

export function getSoundscapeDescription(soundscape: string): string {
  switch (soundscape) {
    case "ocean":
      return "Ocean waves";
    case "forest":
      return "Forest ambiance";
    case "rain":
      return "Gentle rain";
    case "cafe":
      return "Coffee shop buzz";
    case "silence":
      return "Peaceful silence";
    default:
      return "Focus environment";
  }
}