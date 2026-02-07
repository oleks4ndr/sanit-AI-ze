"use client";

import { useState } from "react";
import { Logo } from "./components/Logo";
import { PromptInput } from "./components/PromptInput";
import { judgePrompt } from "./actions/judge";

export default function Home() {
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<any>(null);

	const handleSubmit = async (prompt: string) => {
		setIsLoading(true);
		try {
			const verdict = await judgePrompt(prompt);
			setResult(verdict);
		} catch (error) {
			console.error("Error judging prompt:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-black">
			<main className="flex flex-col items-center gap-8 px-8">
				<Logo />
				<PromptInput onSubmit={handleSubmit} isLoading={isLoading} />

				{result && (
					<div className="mt-8 p-6 bg-gray-900 rounded-lg shadow-sm border border-gray-700">
						<pre className="text-sm text-white">
							{JSON.stringify(result, null, 2)}
						</pre>
					</div>
				)}
			</main>
		</div>
	);
}
