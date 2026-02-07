import type { JudgeConfig, JudgeResponse } from "../types.js";
import {
  buildJudgeSystemPrompt,
  buildJudgeUserPrompt,
} from "../prompts.js";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0.5;
  return Math.min(1, Math.max(0, n));
}

function failClosed(reason: string): JudgeResponse {
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
  };
}

function normalize(raw: any): JudgeResponse {
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
    attack_types: Array.isArray(raw?.attack_types)
      ? raw.attack_types
      : [],
    reasons: Array.isArray(raw?.reasons) ? raw.reasons : [],
    expected_output: {
      allowed_content: Array.isArray(raw?.expected_output?.allowed_content)
        ? raw.expected_output.allowed_content
        : [],
      disallowed_content: Array.isArray(
        raw?.expected_output?.disallowed_content
      )
        ? raw.expected_output.disallowed_content
        : [],
    },
  };
}

export async function aiJudge(
  prompt: string,
  config: JudgeConfig
): Promise<JudgeResponse> {
  const apiKey = config.api_key ?? process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return failClosed("Missing OPENAI_API_KEY");
  }

  const base = (config.api_base ?? "https://api.openai.com").replace(/\/$/, "");
  const url = `${base}/v1/chat/completions`;

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    config.timeout_ms ?? 8000
  );

  try {
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
            content: buildJudgeSystemPrompt(
              config.app_policy,
              config.risk_tolerance
            ),
          },
          {
            role: "user",
            content: buildJudgeUserPrompt(prompt),
          },
        ],
      }),
    });

    if (!resp.ok) {
      return failClosed(`OpenAI error ${resp.status}`);
    }

    const data = await resp.json() as any;
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return failClosed("Empty judge response");
    }

    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      return failClosed("Non-JSON judge output");
    }

    return normalize(parsed);
  } catch (err: any) {
    return failClosed(err?.name ?? "Judge failure");
  } finally {
    clearTimeout(timeout);
  }
}
