"use client";

import { useState } from "react";
import { Logo } from "./components/Logo";
import { PromptInput } from "./components/PromptInput";
import { ResultDisplay } from "./components/ResultDisplay";
import { judgePrompt } from "./actions/judge";

interface JudgeResponse {
	risk_score: number;
	risk_level: "low" | "medium" | "high";
	confidence: number;
	verdict: "allow" | "block";
	attack_types: string[];
	reasons: string[];
	expected_output: {
		allowed_content: string[];
		disallowed_content: string[];
	};
	mode: "input" | "output";
	timestamp: number;
}

export default function Home() {
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<JudgeResponse | null>(null);
	const [prompt, setPrompt] = useState("");

	const handleSubmit = async (promptText: string) => {
		setIsLoading(true);
		setPrompt(promptText);
		setResult(null);
		try {
			const verdict = await judgePrompt(promptText);
			setResult(verdict);
		} catch (error) {
			console.error("Error judging prompt:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-start justify-center bg-gradient-to-b from-black via-gray-900 to-black">
			<main className="flex flex-col items-center w-full max-w-5xl px-8 py-20">
				<Logo />
				<PromptInput onSubmit={handleSubmit} isLoading={isLoading} />

				{result && (
					<div className="animate-fade-in mt-12">
						<ResultDisplay prompt={prompt} result={result} />
					</div>
				)}
			</main>
		</div>
	);
}
