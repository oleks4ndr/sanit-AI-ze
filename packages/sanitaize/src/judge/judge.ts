// Legacy judge function for backward compatibility
import type { SanitaizeConfig, JudgeResponse } from "../types";
import { aiJudge } from "./aiJudge";

/**
 * @deprecated Use sanitaize.judgeInput() or sanitaize.judgeOutput() instead
 */
export async function judge(
	prompt: string,
	config: SanitaizeConfig,
): Promise<JudgeResponse> {
	return aiJudge(prompt, config, "input");
}
