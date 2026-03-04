# WisBot AI Demo - Roadmap

Proposed next steps for evolving this POC into a more complete solution. Organized by priority for enterprise evaluation.

---

## Phase 1: Quick Wins (High Impact, Low Effort)

### 1. Streaming Responses
**What:** Show the AI response word-by-word as it generates, instead of waiting for the complete answer.
**Why:** Makes the bot feel significantly more responsive. Users see output immediately instead of staring at a typing indicator for 3-5 seconds.
**Effort:** Small - backend switches to OpenAI streaming API, frontend reads a Server-Sent Events stream.

### 2. Conversation Starter Chips
**What:** Add clickable suggestion buttons at the top of the chat panel (e.g., "Getting Started", "Tyre Selection", "Weight Limits") that pre-fill common questions.
**Why:** Guides users who don't know what to ask. Demonstrates the bot's capabilities immediately.
**Effort:** Small - frontend-only change. Configurable list of starter prompts.

### 3. PDF Document Support
**What:** Allow dropping PDF files into the `docs/` folder alongside `.md` and `.txt` files.
**Why:** Most enterprise documentation is in PDF format. Without this, users must manually convert files.
**Effort:** Small - add a PDF text extraction library (e.g., `pdf-parse`) to the document loader.

---

## Phase 2: Enterprise Readiness (Medium Effort)

### 4. Swap AI Provider (Azure OpenAI / Anthropic Claude)
**What:** Make the AI provider configurable so the same app can use Azure OpenAI (enterprise), Anthropic Claude, or standard OpenAI.
**Why:** Most enterprises require AI calls to go through their own Azure OpenAI deployment or an approved provider. This is often a hard requirement for security and compliance.
**Effort:** Medium - abstract the AI client behind a provider interface, add config options for API base URL and provider type.
**Config example:**
```env
AI_PROVIDER=azure          # openai | azure | anthropic
AZURE_OPENAI_ENDPOINT=https://your-company.openai.azure.com
AZURE_OPENAI_KEY=your-azure-key
AZURE_DEPLOYMENT_NAME=gpt-4o-mini
```

### 5. Basic Usage Logging
**What:** Log all questions and responses to a local file (`logs/chat.log`) with timestamps.
**Why:** Allows the team to review what users are asking, identify common questions, and evaluate answer quality. Essential data for deciding whether to invest further.
**Effort:** Small - add a logging middleware to the chat endpoint.
**Output example:**
```
[2026-03-04 14:23:01] USER: How do I select different tyres?
[2026-03-04 14:23:04] BOT: In the Configuration screen, scroll to the Tyres section...
```

### 6. Chat History Persistence
**What:** Save conversation history in the browser (localStorage) or on the server (SQLite/JSON file) so chats survive page refreshes.
**Why:** Users lose their conversation when they refresh. For longer sessions this is frustrating.
**Effort:** Medium - localStorage for simple persistence, or SQLite for server-side storage with user sessions.

---

## Phase 3: Scaling Up (Higher Effort)

### 7. Vector RAG (Retrieval-Augmented Generation)
**What:** Replace context stuffing with an embedding-based retrieval system. Documents are split into chunks, converted to vector embeddings, and stored in a vector database. Only relevant chunks are sent to the AI for each question.
**Why:** The current approach loads ALL documents into every request. This works for small doc sets (under ~75K words) but breaks with larger libraries. RAG scales to thousands of documents.
**Effort:** High - requires embeddings generation, a vector store (ChromaDB, Pinecone, or pgvector), chunking strategy, and retrieval logic.
**Architecture:**
```
User question
     |
     v
Generate embedding for question
     |
     v
Search vector DB for similar chunks (top 5-10)
     |
     v
Send only relevant chunks + question to AI
     |
     v
Return grounded answer
```

### 8. Document Upload via UI
**What:** Add a drag-and-drop upload area in the web UI so users can add documents without server access.
**Why:** Currently, adding docs requires file system access to the `docs/` folder. A UI upload makes it self-service.
**Effort:** Medium - file upload endpoint, storage management, document reprocessing on upload.

### 9. Authentication & User Management
**What:** Add login functionality (enterprise SSO, OAuth, or simple token-based auth).
**Why:** Required before any production deployment. Controls who can access the bot and the documentation.
**Effort:** High - depends on the enterprise identity provider (Azure AD, Okta, etc.).

---

## Phase 4: Advanced Features (Future Vision)

### 10. Multi-Turn Agent with Tools
**What:** Give the AI the ability to use tools - search specific documents, look up definitions, query a database, or trigger actions in external systems.
**Why:** Moves beyond simple Q&A into an intelligent assistant that can perform tasks.
**Effort:** High - requires defining tool schemas, implementing tool execution, and managing agent conversation flow.
**Technology:** Could use OpenAI function calling, Anthropic tool use, or MCP (Model Context Protocol) for standardized tool integration.

### 11. Feedback & Quality Tracking
**What:** Add thumbs up/down buttons on bot responses. Track which answers users find helpful vs unhelpful.
**Why:** Provides data to improve the system over time. Identifies documentation gaps.
**Effort:** Medium - UI buttons, feedback storage, basic analytics dashboard.

### 12. Multi-Language Support
**What:** Allow the bot to answer in the user's preferred language, even if documentation is in English.
**Why:** Useful for international teams where not everyone is comfortable reading English documentation.
**Effort:** Small - mostly a system prompt change. The AI handles translation natively.

---

## Decision Matrix

| Feature | Impact | Effort | Priority |
|---------|--------|--------|----------|
| Streaming responses | High | Low | Do first |
| Conversation starters | Medium | Low | Do first |
| PDF support | High | Low | Do first |
| Azure OpenAI / Claude | High | Medium | Do second |
| Usage logging | Medium | Low | Do second |
| Chat persistence | Medium | Medium | Do second |
| Vector RAG | High | High | Plan for later |
| Document upload UI | Medium | Medium | Plan for later |
| Authentication | High | High | Required for production |
| Agent with tools | High | High | Future vision |
| Feedback tracking | Medium | Medium | Future vision |
| Multi-language | Medium | Low | Nice to have |
