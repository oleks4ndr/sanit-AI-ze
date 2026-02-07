"use client";

import { useState } from "react";

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

interface ResultDisplayProps {
	prompt: string;
	result: JudgeResponse;
}

export function ResultDisplay({ prompt, result }: ResultDisplayProps) {
	const [showJson, setShowJson] = useState(false);

	const verdictColor = result.verdict === "allow" ? "bg-green-500" : "bg-red-500";
	const riskColor =
		result.risk_level === "low"
			? "text-green-400"
			: result.risk_level === "medium"
				? "text-yellow-400"
				: "text-red-400";

	const riskBarColor =
		result.risk_level === "low"
			? "bg-green-500"
			: result.risk_level === "medium"
				? "bg-yellow-500"
				: "bg-red-500";

	return (
		<div className="w-full max-w-3xl space-y-6">
			{/* Timeline Flow */}
			<div className="relative">
				{/* Step 1: Input */}
				<div className="flex items-start gap-5 mb-10">
					<div className="flex flex-col items-center">
						<div className="w-12 h-12 rounded-full bg-cyan-400 flex items-center justify-center text-black font-bold text-lg shadow-lg">
							1
						</div>
						<div className="w-0.5 h-20 bg-gray-700 mt-3"></div>
					</div>
					<div className="flex-1 pt-2">
						<h3 className="text-xl font-semibold text-white mb-3">
							Input Received
						</h3>
						<div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-5 backdrop-blur-sm shadow-lg">
							<p className="text-gray-300 text-sm leading-relaxed wrap-break-words">
								{prompt}
							</p>
						</div>
					</div>
				</div>

				{/* Step 2: Analysis */}
				<div className="flex items-start gap-5 mb-10">
					<div className="flex flex-col items-center">
						<div className="w-12 h-12 rounded-full bg-cyan-400 flex items-center justify-center text-black font-bold text-lg shadow-lg">
							2
						</div>
						<div className="w-0.5 h-20 bg-gray-700 mt-3"></div>
					</div>
					<div className="flex-1 pt-2">
						<h3 className="text-xl font-semibold text-white mb-3">
							AI Analysis
						</h3>
						<div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-5 space-y-5 backdrop-blur-sm shadow-lg">
							{/* Risk Score */}
							<div>
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm text-gray-400">
										Risk Score
									</span>
									<span
										className={`text-sm font-semibold ${riskColor}`}>
										{(result.risk_score * 100).toFixed(1)}%
									</span>
								</div>
								<div className="w-full bg-gray-800 rounded-full h-2">
									<div
										className={`${riskBarColor} h-2 rounded-full transition-all`}
										style={{
											width: `${result.risk_score * 100}%`,
										}}></div>
								</div>
							</div>

							{/* Confidence */}
							<div>
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm text-gray-400">
										Confidence
									</span>
									<span className="text-sm text-cyan-400 font-semibold">
										{(result.confidence * 100).toFixed(1)}%
									</span>
								</div>
								<div className="w-full bg-gray-800 rounded-full h-2">
									<div
										className="bg-cyan-500 h-2 rounded-full transition-all"
										style={{
											width: `${result.confidence * 100}%`,
										}}></div>
								</div>
							</div>

							{/* Attack Types */}
							{result.attack_types.length > 0 && (
								<div>
									<span className="text-sm text-gray-400 block mb-2">
										Detected Threats
									</span>
									<div className="flex flex-wrap gap-2">
										{result.attack_types.map((type, idx) => (
											<span
												key={idx}
												className="px-3 py-1 bg-red-900/50 border border-red-700 text-red-300 rounded-full text-xs font-medium">
												{type.replace(/_/g, " ")}
											</span>
										))}
									</div>
								</div>
							)}

							{/* Reasons */}
							{result.reasons.length > 0 && (
								<div>
									<span className="text-sm text-gray-400 block mb-2">
										Analysis Details
									</span>
									<ul className="space-y-1">
										{result.reasons.map((reason, idx) => (
											<li
												key={idx}
												className="text-sm text-gray-300 flex items-start gap-2">
												<span className="text-cyan-400 mt-1">
													•
												</span>
												<span>{reason}</span>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Step 4: Model Output */}
				<div className="flex items-start gap-5">
					<div className="flex flex-col items-center">
						<div className="w-12 h-12 rounded-full bg-cyan-400 flex items-center justify-center text-black font-bold text-lg shadow-lg">
							4
						</div>
					</div>
					<div className="flex-1 pt-2">
						<h3 className="text-xl font-semibold text-white mb-3">
							Model Output
						</h3>
						<div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm shadow-lg">
							{result.verdict === "block" ? (
								<div className="space-y-4">
									<div className="flex items-center gap-3">
										<span className="text-4xl">🚫</span>
										<div>
											<p className="text-red-400 font-semibold text-lg">
												Request Blocked
											</p>
											<p className="text-gray-400 text-sm">
												This prompt was prevented from reaching
												the AI model
											</p>
										</div>
									</div>
									<div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4">
										<p className="text-gray-300 text-sm leading-relaxed">
											I apologize, but I cannot process this request
											as it violates our content policy. The prompt
											contains elements that could lead to harmful,
											unethical, or unsafe outputs. Please rephrase
											your request in a way that aligns with our
											safety guidelines.
										</p>
									</div>
								</div>
							) : (
								<div className="space-y-4">
									<div className="flex items-center gap-3">
										<span className="text-4xl">✅</span>
										<div>
											<p className="text-green-400 font-semibold text-lg">
												Request Allowed
											</p>
											<p className="text-gray-400 text-sm">
												This prompt is safe and can be processed
												by the AI model
											</p>
										</div>
									</div>
									<div className="bg-green-950/20 border border-green-900/30 rounded-lg p-4">
										<p className="text-gray-300 text-sm leading-relaxed">
											The AI model would proceed to process this
											request normally, generating a helpful and
											safe response based on the input provided. The
											prompt has been analyzed and contains no
											harmful intent or policy violations.
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Step 3: Decision */}
				<div className="flex items-start gap-5 mb-10">
					<div className="flex flex-col items-center">
						<div className="w-12 h-12 rounded-full bg-cyan-400 flex items-center justify-center text-black font-bold text-lg shadow-lg">
							3
						</div>
						<div className="w-0.5 h-20 bg-gray-700 mt-3"></div>
					</div>
					<div className="flex-1 pt-2">
						<h3 className="text-xl font-semibold text-white mb-3">
							Final Verdict
						</h3>
						<div
							className={`${verdictColor} rounded-xl p-8 text-center shadow-xl`}>
							<p className="text-3xl font-bold text-white uppercase tracking-wider">
								{result.verdict}
							</p>
							<p className="text-sm text-white/80 mt-2">
								Risk Level:{" "}
								<span className="font-semibold">
									{result.risk_level.toUpperCase()}
								</span>
							</p>
						</div>

						{/* Expected Output */}
						{result.expected_output && (
							<div className="mt-5 bg-gray-900/60 border border-gray-700/50 rounded-xl p-5 backdrop-blur-sm">
								<p className="text-sm font-semibold text-gray-400 mb-3">
									Expected Output Guidelines
								</p>
								{result.expected_output.allowed_content.length > 0 && (
									<div className="mb-3">
										<p className="text-sm text-green-400 mb-2 font-medium">
											✓ Allowed:
										</p>
										<ul className="text-sm text-gray-300 space-y-1.5 pl-4">
											{result.expected_output.allowed_content.map(
												(item, idx) => (
													<li key={idx}>• {item}</li>
												),
											)}
										</ul>
									</div>
								)}
								{result.expected_output.disallowed_content.length > 0 && (
									<div>
										<p className="text-sm text-red-400 mb-2 font-medium">
											✗ Disallowed:
										</p>
										<ul className="text-sm text-gray-300 space-y-1.5 pl-4">
											{result.expected_output.disallowed_content.map(
												(item, idx) => (
													<li key={idx}>• {item}</li>
												),
											)}
										</ul>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* JSON Toggle */}
			<div className="mt-8 pt-6 border-t border-gray-800">
				<button
					onClick={() => setShowJson(!showJson)}
					className="px-5 py-2.5 text-sm font-medium text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 rounded-lg transition-all border border-cyan-400/30 hover:border-cyan-400/50">
					{showJson ? "Hide" : "Show"} Raw JSON
				</button>

				{showJson && (
					<pre className="mt-5 bg-gray-900/60 border border-gray-700/50 rounded-xl p-5 text-xs text-gray-300 overflow-x-auto backdrop-blur-sm shadow-lg">
						{JSON.stringify(result, null, 2)}
					</pre>
				)}
			</div>
		</div>
	);
}
