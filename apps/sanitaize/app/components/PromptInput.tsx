"use client";

import { useState, useRef, useEffect } from "react";

interface PromptInputProps {
	onSubmit: (prompt: string) => void;
	isLoading?: boolean;
}

export function PromptInput({ onSubmit, isLoading = false }: PromptInputProps) {
	const [prompt, setPrompt] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (prompt.trim()) {
			onSubmit(prompt);
		}
	};

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [prompt]);

	const isDisabled = !prompt.trim() || isLoading;

	return (
		<form
			onSubmit={handleSubmit}
			className="w-full max-w-3xl flex flex-col gap-5 mt-8">
			<div className="relative">
				<textarea
					ref={textareaRef}
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					placeholder="Enter a prompt to analyze..."
					className="w-full px-6 py-5 text-base text-white bg-gray-900/80 border-2 border-gray-700 rounded-2xl focus:outline-none focus:border-cyan-400 focus:bg-gray-900 transition-all placeholder:text-gray-500 resize-none overflow-auto shadow-lg"
					disabled={isLoading}
					rows={1}
					style={{ minHeight: "56px", maxHeight: "300px" }}
				/>
			</div>
			<button
				type="submit"
				disabled={isDisabled}
				className={`px-8 py-4 rounded-xl text-black font-semibold transition-all text-base shadow-lg ${
					isDisabled
						? "bg-gray-700 cursor-not-allowed opacity-50"
						: "bg-cyan-400 hover:bg-cyan-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
				}`}>
				{isLoading ? (
					<span className="flex items-center justify-center gap-2">
						<span className="animate-pulse">Analyzing</span>
						<span className="flex gap-1">
							<span
								className="animate-bounce"
								style={{ animationDelay: "0ms" }}>
								.
							</span>
							<span
								className="animate-bounce"
								style={{ animationDelay: "150ms" }}>
								.
							</span>
							<span
								className="animate-bounce"
								style={{ animationDelay: "300ms" }}>
								.
							</span>
						</span>
					</span>
				) : (
					"Analyze Prompt"
				)}
			</button>
		</form>
	);
}
