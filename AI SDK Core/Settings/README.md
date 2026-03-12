
# Settings Folder README

This folder contains examples demonstrating how to configure advanced settings for text generation with the Vercel AI SDK. All examples integrate with **Langfuse** for observability and tracing.

## Files Overview

### Settings.ts
Demonstrates core generation settings to control model behavior and resource usage:
- **maxOutputTokens**: Caps the model's response length to prevent rambling (e.g., 512 tokens)
- **temperature**: Controls determinism and creativity (set to 0.3 for focused, predictable responses)
- **maxRetries**: Automatically retries if the connection drops (e.g., 5 attempts)
- Integrates with **Langfuse** via OpenTelemetry for tracing

### abortSignal.ts
Demonstrates handling request timeouts and cancellation:
- Uses `AbortSignal.timeout()` to enforce time limits on generation (e.g., 3 seconds)
- Shows graceful error handling for timeout and abort errors
- Useful for preventing long-running requests from blocking your application
- Traces the aborted request lifecycle to Langfuse

### headers.ts
Shows how to inject custom HTTP headers into requests:
- Send custom metadata like `Prompt-Id`, `X-App-Platform`, etc.
- Useful for tracking, routing through proxies, or adding organization IDs
- Headers are sent with every underlying HTTP POST request
- Supports observability and request identification

### timeout.ts
Similar to headers.ts — demonstrates custom header injection with Langfuse tracing enabled.

## Key Patterns

All examples follow this structure:
1. Load environment variables from .env
2. Initialize Langfuse via OpenTelemetry
3. Call `generateText()` with specific settings
4. Handle errors appropriately
5. Flush telemetry data before shutdown

## Running Examples

```bash
node Settings.ts
node abortSignal.ts
node headers.ts
node timeout.ts
```

## Requirements

- Ollama provider (`ollama('llama3.2')`) or similar
- .env file with necessary credentials
- Langfuse SDK and OpenTelemetry setup
- Node.js environment