// src/judge/judge.ts
import type { JudgeConfig, JudgeResponse } from "../types.js";
import { aiJudge } from "./aijudge.js";

export async function judge(
  prompt: string,
  config: JudgeConfig
): Promise<JudgeResponse> {
  return aiJudge(prompt, config);
}
