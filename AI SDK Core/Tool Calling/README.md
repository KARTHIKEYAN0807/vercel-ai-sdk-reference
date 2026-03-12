
---

# Tool Calling

This folder contains comprehensive examples demonstrating tool calling capabilities in the Vercel AI SDK. Tool calling enables AI models to request specific functions/tools to be executed as part of their response generation.

## Files Overview

### Tool calling.ts
**Basic tool calling example.** Demonstrates the fundamental pattern of defining tools with parameters and executing them in response to model requests.

**Key concepts:**
- Defining tools with descriptions and parameters using Zod schemas
- Executing tools synchronously
- Streaming tool results back to the model
- Using `stopWhen: stepCountIs(n)` to limit tool loop iterations

### Active Tools.ts
Shows how to **selectively enable/disable tools** using the `activeTools` parameter. Restricts which tools are available to the model during execution.

**Key concepts:**
- Using `activeTools` array to filter available tools
- Hiding specific tools from the model entirely
- Controlling model behavior through tool visibility

### Tool Choice.ts
Demonstrates **forcing the model to use tools** via the `toolChoice: 'required'` parameter. Ensures a tool will be called even if the model might otherwise respond without one.

**Key concepts:**
- Setting `toolChoice: 'required'`
- Forcing deterministic tool invocation
- Using `stopWhen` to control loop iterations

### Abort Signals.ts
Shows how to **interrupt tool execution** using `AbortSignal`. Useful for cancelling long-running operations.

**Key concepts:**
- Creating `AbortController` and passing signals to tools
- Checking `abortSignal.aborted` within tool execution
- Handling timeouts and user cancellations

### Steps.ts
Demonstrates how to **inspect the history of tool calls** and model decisions. The `steps` array contains detailed records of everything the model did.

**Key concepts:**
- Accessing `result.steps` array
- Iterating through tool calls and their arguments
- Understanding execution history and debugging

### Multi-Step Calls (using stopWhen).ts.ts)
Shows how to **manage multiple sequential tool calls** and control the loop termination using `stopWhen`.

**Key concepts:**
- Using `stopWhen: stepCountIs(n)` to limit iterations
- Understanding multi-step reasoning loops
- Managing context across multiple tool invocations

### Type Safe Handling.ts
Demonstrates **type-safe tool parameter validation** and the `experimental_repairToolCall` callback for self-healing tool calls.

**Key concepts:**
- Validating tool parameters match schema
- Using `experimental_repairToolCall` to recover from errors
- Handling `NoSuchToolError` gracefully
- Self-correcting tool invocations

### Tool Call Repair.ts
Similar to Type Safe Handling, shows **automatic repair of malformed tool calls**. The SDK can attempt to fix errors without failing.

**Key concepts:**
- Tool call error recovery
- Using repair callbacks
- Fallback mechanisms for invalid tool inputs

### Multi model Tool Results.ts
Shows how to **transform tool outputs for different models** using the `toModelOutput()` method. Different models may have different output format requirements.

**Key concepts:**
- Custom `toModelOutput()` transformation
- Handling enum-based tool parameters
- Formatting tool results for model consumption
- Safety constraints (e.g., enforcing action whitelist)

### Handling Approval Requests.ts
Demonstrates **requiring human approval before executing sensitive tools**. Tools can be marked with `needsApproval: true`.

**Key concepts:**
- Setting `needsApproval: true` on tools
- Detecting `tool-approval-request` in response content
- Sending `tool-approval-response` messages
- Implementing human-in-the-loop workflows

### Tool Input Lifecycle Hooks.ts
Shows **streaming hooks for monitoring tool parameter generation** in real-time. Works with `streamText()` to watch input construction.

**Key concepts:**
- `onInputStart()` - Tool call beginning
- `onInputDelta()` - Streaming argument chunks
- `onInputAvailable()` - Complete parameters ready
- Real-time monitoring of tool invocations

### Types.ts
Demonstrates **distinguishing between static and dynamic tools** and using callbacks like `onStepFinish()` to inspect tool calls.

**Key concepts:**
- Static tools vs dynamic tools
- Using `dynamicTool()` for flexible tools
- `onStepFinish()` callback for step inspection
- Type-safe tool call differentiation

---

