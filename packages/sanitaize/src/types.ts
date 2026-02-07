export type RiskTolerance = "low" | "medium" | "high";
export type JudgeMode = "input" | "output";

export interface SanitaizeConfig {
	app_policy: string;
	risk_tolerance: RiskTolerance;
	firewall_model: string;
	firewall_api_key: string;
	api_base?: string;
	timeout_ms?: number;
}

export interface ExpectedOutput {
	allowed_content: string[];
	disallowed_content: string[];
}

export interface JudgeResponse {
	risk_score: number; // 0..1
	risk_level: "low" | "medium" | "high";
	confidence: number; // 0..1
	verdict: "allow" | "block";
	attack_types: string[];
	reasons: string[];
	expected_output: ExpectedOutput;
	mode: JudgeMode;
	timestamp: number;
}

// Legacy aliases for backward compatibility
export type JudgeConfig = SanitaizeConfig;
