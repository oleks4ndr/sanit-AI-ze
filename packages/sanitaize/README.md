# sanitaize

AI firewall for sanitizing LLM inputs and outputs.

## Installation

```bash
npm install sanitaize
```

## Usage

```typescript
import { judge } from "sanitaize";

const verdict = await judge({
	prompt: "User input to validate",
	config: {
		app_policy: "Your application policy",
		risk_tolerance: "medium",
		firewall_model: "gpt-4",
	},
});

console.log(verdict.allowed); // true or false
console.log(verdict.reason); // optional explanation
```

## Build

```bash
npm run build
```
