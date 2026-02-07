export interface SanitaizeConfig {
	app_policy: string;
	risk_tolerance: "low" | "medium" | "high";
	firewall_model: string;
}

export interface JudgeInput {
	prompt: string;
	config?: Partial<SanitaizeConfig>;
}

export interface JudgeVerdict {
	allowed: boolean;
	reason?: string;
}
