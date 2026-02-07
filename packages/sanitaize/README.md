# sanitaize

AI firewall for sanitizing LLM inputs and outputs. Detect prompt injections, jailbreaks, PII leakage, and policy violations before they reach your LLM or your users.

## Installation

```bash
npm install sanitaize
```

## Quick Start

```typescript
import { sanitaize } from "sanitaize";

// Configure once
sanitaize.config = {
	app_policy: "No harmful, illegal, or explicit content allowed",
	risk_tolerance: "medium",
	firewall_model: "gpt-4",
	firewall_api_key: process.env.OPENAI_API_KEY!,
};

// Judge user input before sending to your LLM
const inputVerdict = await sanitaize.judgeInput(userPrompt);

if (inputVerdict.verdict === "block") {
	console.log("Attack detected:", inputVerdict.attack_types);
	console.log("Reasons:", inputVerdict.reasons);
	return { error: "Input rejected by firewall" };
}

// Your LLM call here
const llmResponse = await yourLLM.generate(userPrompt);

// Judge LLM output before showing to user
const outputVerdict = await sanitaize.judgeOutput(llmResponse);

if (outputVerdict.verdict === "block") {
	console.log("🚫 Policy violation in output:", outputVerdict.reasons);
	return { error: "Response blocked by firewall" };
}

return { response: llmResponse };
```

## API

### Configuration

```typescript
sanitaize.config = {
  app_policy: string;           // Your application's content policy
  risk_tolerance: "low" | "medium" | "high";
  firewall_model: string;       // Model for judging (e.g., "gpt-4", "gpt-3.5-turbo")
  firewall_api_key: string;     // API key for the firewall model
  api_base?: string;            // Optional: custom API endpoint
  timeout_ms?: number;          // Optional: request timeout (default: 8000ms)
};
```

### Methods

#### `sanitaize.judgeInput(text: string): Promise<JudgeResponse>`

Analyze user input for security threats before it reaches your LLM.

Detects:

- Prompt injection attempts
- Jailbreak attempts
- PII leakage requests
- Policy violations
- Social engineering
- Data exfiltration attempts

#### `sanitaize.judgeOutput(text: string): Promise<JudgeResponse>`

Analyze LLM output for policy violations before showing to users.

Detects:

- Policy violations
- PII leakage
- Harmful content
- Prompt/system leakage
- Inappropriate tone

#### Response Format

```typescript
interface JudgeResponse {
	risk_score: number; // 0-1, higher = more risky
	risk_level: "low" | "medium" | "high";
	confidence: number; // 0-1, AI's confidence in judgment
	verdict: "allow" | "block";
	attack_types: string[]; // e.g., ["prompt_injection", "jailbreak"]
	reasons: string[]; // Human-readable explanations
	expected_output: {
		allowed_content: string[];
		disallowed_content: string[];
	};
	mode: "input" | "output";
	timestamp: number;
}
```

## Risk Tolerance Levels

- **`low`**: Block anything with risk_score > 0.3. Very strict, may have false positives.
- **`medium`**: Block anything with risk_score > 0.6. Balanced security and usability.
- **`high`**: Block only clear attacks with risk_score > 0.8. Permissive, fewer false positives.

## Using Different LLM Providers

Sanitaize works with any OpenAI-compatible API:

### OpenAI

```typescript
sanitaize.config = {
	firewall_model: "gpt-4",
	firewall_api_key: process.env.OPENAI_API_KEY!,
	// ... other config
};
```

### Custom API Endpoint

```typescript
sanitaize.config = {
	firewall_model: "your-model",
	firewall_api_key: "your-key",
	api_base: "https://your-api.com",
	// ... other config
};
```

## Advanced Usage

### Conditional Filtering

```typescript
const verdict = await sanitaize.judgeInput(userInput);

if (verdict.risk_level === "high") {
	return { error: "Request blocked" };
} else if (verdict.risk_level === "medium") {
	// Log for review but allow
	await logSuspiciousActivity(userInput, verdict);
}

// Proceed with LLM call
```

### Custom Policies

```typescript
sanitaize.config = {
	app_policy: `
    Allowed: General questions, educational content, creative writing
    Disallowed: Medical advice, financial advice, illegal activities
    Special rules: Be strict about privacy, never reveal user data
  `,
	risk_tolerance: "low",
	firewall_model: "gpt-4",
	firewall_api_key: process.env.OPENAI_API_KEY!,
};
```

## Build

```bash
npm run build    # Build once
npm run dev      # Watch mode
```

## License

MIT
