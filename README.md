# WisBot AI Demo

A proof-of-concept web app demonstrating an AI chatbot that answers user questions based on uploaded documentation files. Built to evaluate the feasibility of adding AI-powered documentation support to enterprise applications.

## What it does

- Loads documentation files (`.md`, `.txt`) from the `docs/` folder
- Provides a floating chat panel accessible via a button in the header
- Uses OpenAI's API to answer questions grounded in your documentation
- **Multi-language support** — switch between English, Swedish, German, Chinese (Mandarin), and Hindi using the language selector in the header. Both the UI and AI responses adapt to the selected language.
- Runs entirely locally - no external services beyond the AI API

## Prerequisites

- **Node.js** v18 or later (v20+ recommended) - [Download](https://nodejs.org/)
- **OpenAI API key** - [Get one here](https://platform.openai.com/api-keys)

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Michael-Kappi/wisbot-aitest.git
cd wisbot-aitest

# 2. Install dependencies
npm install

# 3. Configure your API key
cp .env.example .env
# Edit .env and replace 'your-api-key-here' with your actual OpenAI API key

# 4. Start the server
npm start
```

Open **http://localhost:3001** in your browser. Click the chat icon in the top-right corner to start asking questions.

## Adding Your Own Documents

1. Place `.md` or `.txt` files in the `docs/` folder
2. Restart the server (`npm start`)
3. The AI assistant will now answer questions based on your documents

The demo includes two sample files (`sample-guide.md` and `sample-faq.md`) so you can try it immediately. Replace or add to these with your own content.

## Configuration

Edit the `.env` file to customize:

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | *(required)* | Your OpenAI API key |
| `OPENAI_MODEL` | `gpt-4o-mini` | Model to use (e.g., `gpt-4o`, `gpt-3.5-turbo`) |
| `PORT` | `3001` | Server port |

## How It Works

```
User question
     |
     v
[Browser] --POST /api/chat--> [Express Server]
                                     |
                                     v
                              Loads docs from docs/
                              Builds system prompt with doc content
                              Sends to OpenAI API
                                     |
                                     v
                              Returns AI response
                                     |
     <-------------------------------
     |
[Chat Panel displays answer]
```

**Architecture:**
- **Frontend**: Plain HTML/CSS/JS served as static files (no build step)
- **Backend**: Node.js + Express proxies requests to OpenAI, keeping the API key secure
- **Document strategy**: All documents are loaded into the system prompt ("context stuffing"). This works well for document sets under ~75,000 words

## Project Structure

```
wisbot-aitest/
├── server.js          # Express server, doc loading, OpenAI proxy
├── package.json       # Dependencies and scripts
├── .env.example       # API key template
├── .gitignore         # Ignores node_modules and .env
├── README.md          # This file
├── docs/              # Place documentation files here
│   ├── sample-guide.md
│   └── sample-faq.md
└── public/            # Static frontend files
    ├── index.html     # Page layout and chat panel
    ├── style.css      # Styling
    └── chat.js        # Chat logic
```

## Limitations

- **Context window**: Total document size should stay under ~75,000 words to leave room for conversation. For larger document sets, a vector-based RAG approach would be needed.
- **No persistence**: Chat history is lost on page refresh (stored in browser memory only)
- **No authentication**: This is a demo - add authentication before any production use
- **Single model**: Currently supports OpenAI only. Can be extended to other providers.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "API key not configured" error | Make sure `.env` exists and contains a valid `OPENAI_API_KEY` |
| Port already in use | Change `PORT` in `.env` to another value (e.g., `3002`) |
| Slow responses | Normal for AI API calls. GPT-4o-mini is the fastest option. |
| "Network error" in chat | Check that the server is running (`npm start`) |

## Next Steps

See [ROADMAP.md](ROADMAP.md) for a detailed breakdown of proposed improvements organized by priority and effort level.

## License

MIT
