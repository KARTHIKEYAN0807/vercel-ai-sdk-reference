# Prompt Engineering

This folder contains practical examples and techniques for working with prompts in the Vercel AI SDK.

## Files Overview

### HTTP Request Bodies.ts
Demonstrates how to **inspect the HTTP request body** being sent to the model. Useful for debugging and understanding what parameters are actually being transmitted to the API.

**Key concepts:**
- Accessing `result.request.body`
- Parsing and logging request payloads
- Understanding provider-specific request formats

### Inspecting Warnings.ts
Shows how to **detect and handle warnings** returned by models (particularly with local models like Ollama). Models may warn about unsupported settings or adjustments they make.

**Key concepts:**
- Checking `result.warnings` array
- Handling provider-specific warnings
- Working with frequency penalties and other parameters

### Temperature Settings.ts
Practical example of using **temperature control** in a terminal assistant use case. Demonstrates setting temperature to 0 for deterministic model behavior.

**Key concepts:**
- Setting `temperature: 0` for consistent outputs
- Building tools that execute commands
- Parsing and cleaning model-generated tool inputs

### Tool & Structured Data Schemas.ts
Demonstrates **generating structured data with Zod schemas**. Shows best practices like receiving dates as strings and transforming them afterward since local models struggle with date transformations during generation.

**Key concepts:**
- Using `generateObject` with schemas
- Working with Zod for type validation
- Post-processing and transforming generated data

---