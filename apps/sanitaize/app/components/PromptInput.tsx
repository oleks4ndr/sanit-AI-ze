"use client";

import { useState } from "react";

interface PromptInputProps {
	onSubmit: (prompt: string) => void;
	isLoading?: boolean;
}

export function PromptInput({ onSubmit, isLoading = false }: PromptInputProps) {
	const [prompt, setPrompt] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (prompt.trim()) {
			onSubmit(prompt);
		}
	};

	const isDisabled = !prompt.trim() || isLoading;

	return (
		<form onSubmit={handleSubmit} className="w-full max-w-3xl flex flex-col gap-4">
			<textarea
				value={prompt}
				onChange={(e) => setPrompt(e.target.value)}
				placeholder="Add your prompt..."
				className="w-full px-6 py-4 text-lg text-white bg-gray-900 border-2 border-gray-600 rounded-3xl focus:outline-none focus:border-gray-400 transition-colors placeholder:text-gray-500 resize-y min-h-30"
				disabled={isLoading}
				rows={3}
			/>
			<button
				type="submit"
				disabled={isDisabled}
				className={`px-8 py-3 mx-auto max-w-100 rounded-full text-black font-medium transition-all ${
					isDisabled
						? "bg-gray-700 cursor-not-allowed"
						: "bg-cyan-400 hover:bg-cyan-500"
				}`}>
				{isLoading ? "Processing..." : "Show me how it works"}
			</button>
		</form>
	);
}
