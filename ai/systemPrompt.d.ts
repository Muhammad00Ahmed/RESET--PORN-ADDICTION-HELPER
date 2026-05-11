export type BehavioralMode = "URGE" | "VULNERABILITY" | "RECOVERY";
export interface UserContext {
    streak: number;
    totalRelapses: number;
    disciplineScore: number;
    recentTriggers?: string[];
    timeOfDay?: "morning" | "afternoon" | "evening" | "late_night";
    lastRelapseDaysAgo?: number;
}
export declare function detectMode(message: string, urgencyScore: number, context: UserContext): BehavioralMode;
export declare function buildSystemPrompt(mode: BehavioralMode, context: UserContext): string;
export declare function buildInterventionMessages(userMessage: string, mode: BehavioralMode, context: UserContext): Array<{
    role: "user" | "assistant";
    content: string;
}>;
export interface CoachResponse {
    message: string;
    mode: BehavioralMode;
    actionSteps: string[];
    urgencyScore: number;
}
export declare function parseActionSteps(rawMessage: string): string[];
//# sourceMappingURL=systemPrompt.d.ts.map