import type { SanitaizeConfig, JudgeResponse, JudgeMode } from "../types";
import {
	buildInputJudgeSystemPrompt,
	buildOutputJudgeSystemPrompt,
	buildJudgeUserPrompt,
} from "../prompts";

function clamp01(n: number): number {
	if (!Number.isFinite(n)) return 0.5;
	return Math.min(1, Math.max(0, n));
}

function failClosed(reason: string, mode: JudgeMode): JudgeResponse {
	return {
		risk_score: 0.6,
		risk_level: "medium",
		confidence: 0.4,
		verdict: "block",
		attack_types: ["judge_error"],
		reasons: [reason],
		expected_output: {
			allowed_content: [],
			disallowed_content: ["secrets", "system_prompt"],
		},
		mode,
		timestamp: Date.now(),
	};
}

function normalize(raw: any, mode: JudgeMode): JudgeResponse {
	return {
		risk_score: clamp01(Number(raw?.risk_score)),
		risk_level:
			raw?.risk_level === "low" ||
			raw?.risk_level === "medium" ||
			raw?.risk_level === "high"
				? raw.risk_level
				: "medium",
		confidence: clamp01(Number(raw?.confidence)),
		verdict: raw?.verdict === "block" ? "block" : "allow",
		attack_types: Array.isArray(raw?.attack_types) ? raw.attack_types : [],
		reasons: Array.isArray(raw?.reasons) ? raw.reasons : [],
		expected_output: {
			allowed_content: Array.isArray(raw?.expected_output?.allowed_content)
				? raw.expected_output.allowed_content
				: [],
			disallowed_content: Array.isArray(raw?.expected_output?.disallowed_content)
				? raw.expected_output.disallowed_content
				: [],
		},
		mode,
		timestamp: Date.now(),
	};
}

export async function aiJudge(
	text: string,
	config: SanitaizeConfig,
	mode: JudgeMode = "input",
): Promise<JudgeResponse> {
	const apiKey = config.firewall_api_key ?? process.env.OPENAI_API_KEY;
	if (!apiKey) {
		return failClosed("Missing firewall_api_key", mode);
	}

	const base = (config.api_base ?? "https://api.openai.com").replace(/\/$/, "");
	const url = `${base}/v1/chat/completions`;

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), config.timeout_ms ?? 20000);

	try {
		const systemPrompt =
			mode === "input"
				? buildInputJudgeSystemPrompt(config.app_policy, config.risk_tolerance)
				: buildOutputJudgeSystemPrompt(config.app_policy, config.risk_tolerance);

		const resp = await fetch(url, {
			method: "POST",
			signal: controller.signal,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: config.firewall_model,
				temperature: 0,
				messages: [
					{
						role: "system",
						content: systemPrompt,
					},
					{
						role: "user",
						content: buildJudgeUserPrompt(text, mode),
					},
				],
			}),
		});

		if (!resp.ok) {
			return failClosed(`API error ${resp.status}`, mode);
		}

		const data = (await resp.json()) as any;
		const content = data?.choices?.[0]?.message?.content;

		if (!content) {
			return failClosed("Empty judge response", mode);
		}

		let parsed: any;
		try {
			parsed = JSON.parse(content);
		} catch {
			return failClosed("Non-JSON judge output", mode);
		}

		return normalize(parsed, mode);
	} catch (err: any) {
		if (err?.name === "AbortError") {
			return failClosed("Request timeout - prompt analysis took too long", mode);
		}
		return failClosed(err?.message || err?.name || "Judge failure", mode);
	} finally {
		clearTimeout(timeout);
	}
}
