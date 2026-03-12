# AI SDK Core: Event Listeners

This module demonstrates how to use the `onFinish` callback to handle asynchronous side-effects (like database operations) without blocking the main application thread.


**1️⃣ What is it? (Definition)**
Event Listeners in the AI SDK are callback functions (like `onFinish` or `onStepFinish`) that automatically trigger in the background when an AI generation cycle completes.

**2️⃣ Why do we need it? (Purpose)**
It allows you to decouple your core application logic from side-effects. You can return the AI's response to the user immediately, while the event listener handles slow tasks like logging analytics or saving the result to a database in the background.

**3️⃣ Where is it used? (Real usage)**
It is heavily used in production backends (like a Node.js/Express server in a MERN app) to save chat histories to MongoDB or update user token quotas in PostgreSQL without forcing the frontend UI to wait for the database query to finish.

**4️⃣ Where should it NOT be used? (Limitations)**
It should not be used for critical UI state updates. Because event listeners run asynchronously and "fail silently" in the background, if your UI absolutely *must* know if a database save was successful, you should await the save directly in the main function block instead.

**5️⃣ What was used before this? (Older approach)**
Before built-in lifecycle callbacks, developers had to write messy `try/catch/finally` blocks and manually intercept data streams to piece the final text back together before they could save it to a database.