# sanit{AI}ze

A Web application firewall that protects AI agents and LLM applications from prompt injection attacks and malicious inputs.

## Features

- 🛡️ **Input Filtering**: Detect prompt injections, jailbreaks, and malicious user inputs
- 🔍 **Output Filtering**: Validate LLM responses for policy violations and harmful content
- 🎯 **Flexible Configuration**: Customizable risk tolerance and policy enforcement
- 🔌 **Provider Agnostic**: Works with any OpenAI-compatible API
- 📦 **Easy Integration**: Simple singleton API with TypeScript support

## Quick Start

```typescript
import { sanitaize } from "sanitaize";

sanitaize.config = {
	app_policy: "No harmful or illegal content",
	risk_tolerance: "medium",
	firewall_model: "gpt-4",
	firewall_api_key: process.env.OPENAI_API_KEY!,
};

const verdict = await sanitaize.judgeInput(userPrompt);
if (verdict.verdict === "block") {
	console.log("Attack detected:", verdict.attack_types);
}
```

## Setup

See [SETUP.md](./SETUP.md) for detailed setup instructions.

## Project Structure

```
sanit-AI-ze/
├── packages/sanitaize/    # Core NPM package
└── apps/sanitaize/        # Demo web application
```
