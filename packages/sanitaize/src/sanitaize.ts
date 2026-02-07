import type { SanitaizeConfig, JudgeResponse } from "./types";
import { aiJudge } from "./judge/aiJudge";

/**
 * Main Sanitaize class providing AI firewall functionality
 */
class Sanitaize {
	private _config: SanitaizeConfig | null = null;

	/**
	 * Set or update the firewall configuration
	 * @example
	 * ```ts
	 * sanitaize.config = {
	 *   app_policy: "No harmful content allowed",
	 *   risk_tolerance: "medium",
	 *   firewall_model: "gpt-4",
	 *   firewall_api_key: "sk-..."
	 * };
	 * ```
	 */
	set config(cfg: SanitaizeConfig) {
		this._config = cfg;
	}

	/**
	 * Get the current configuration
	 */
	get config(): SanitaizeConfig {
		if (!this._config) {
			throw new Error(
				"Sanitaize not configured. Set sanitaize.config before calling judge methods.",
			);
		}
		return this._config;
	}

	/**
	 * Check if the firewall is configured
	 */
	isConfigured(): boolean {
		return this._config !== null;
	}

	/**
	 * Judge user input before it reaches your LLM
	 * Detects: prompt injection, jailbreaks, PII leakage, policy violations
	 *
	 * @param text - The user input to analyze
	 * @returns Promise resolving to judgment verdict
	 *
	 * @example
	 * ```ts
	 * const verdict = await sanitaize.judgeInput("Ignore previous instructions...");
	 * if (verdict.verdict === "block") {
	 *   console.log("Attack detected:", verdict.attack_types);
	 * }
	 * ```
	 */
	async judgeInput(text: string): Promise<JudgeResponse> {
		return aiJudge(text, this.config, "input");
	}

	/**
	 * Judge LLM output before it reaches the user
	 * Detects: policy violations, PII leakage, harmful content, prompt leakage
	 *
	 * @param text - The LLM output to analyze
	 * @returns Promise resolving to judgment verdict
	 *
	 * @example
	 * ```ts
	 * const llmResponse = await yourLLM.generate(prompt);
	 * const verdict = await sanitaize.judgeOutput(llmResponse);
	 * if (verdict.verdict === "allow") {
	 *   return llmResponse;
	 * }
	 * ```
	 */
	async judgeOutput(text: string): Promise<JudgeResponse> {
		return aiJudge(text, this.config, "output");
	}

	/**
	 * Generic judge method (defaults to input mode)
	 * @deprecated Use judgeInput() or judgeOutput() for clarity
	 */
	async judge(text: string): Promise<JudgeResponse> {
		return this.judgeInput(text);
	}
}

/**
 * Singleton instance of Sanitaize
 *
 * @example
 * ```ts
 * import { sanitaize } from "sanitaize";
 *
 * sanitaize.config = {
 *   app_policy: "No harmful or explicit content",
 *   risk_tolerance: "medium",
 *   firewall_model: "gpt-4",
 *   firewall_api_key: process.env.FIREWALL_API_KEY!
 * };
 *
 * const verdict = await sanitaize.judgeInput(userPrompt);
 * ```
 */
export const sanitaize = new Sanitaize();
