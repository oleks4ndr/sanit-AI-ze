// Main singleton instance export
export { sanitaize } from "./sanitaize";

// Type exports
export type {
	SanitaizeConfig,
	JudgeResponse,
	ExpectedOutput,
	RiskTolerance,
	JudgeMode,
	JudgeConfig, // Legacy alias
} from "./types";

// Legacy function export for backward compatibility
export { judge } from "./judge/judge";
