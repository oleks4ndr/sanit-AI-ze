export type RiskTolerance = "low" | "medium" | "high";

export interface JudgeConfig {
  app_policy: string;
  risk_tolerance: RiskTolerance;
  firewall_model: string;
  api_base?: string;
  api_key?: string;
  timeout_ms?: number;
}

export interface ExpectedOutput {
  allowed_content: string[];
  disallowed_content: string[];
}

export interface JudgeResponse {
  risk_score: Float32Array; // 0..1
  risk_level: "low" | "medium" | "high";
  confidence: Float32Array; // 0..1
  verdict: "allow" | "block";
  attack_types: string[];
  reasons: string[];
  expected_output: ExpectedOutput;
}
