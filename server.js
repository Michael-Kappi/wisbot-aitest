require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// ---------------------------------------------------------------------------
// Document Loading
// ---------------------------------------------------------------------------
function loadDocuments() {
  const docsDir = path.join(__dirname, 'docs');

  if (!fs.existsSync(docsDir)) {
    console.log('[WisBot] No docs/ folder found. Creating one with a placeholder.');
    fs.mkdirSync(docsDir, { recursive: true });
    return { text: '', count: 0 };
  }

  const files = fs.readdirSync(docsDir).filter(f =>
    f.endsWith('.md') || f.endsWith('.txt')
  );

  if (files.length === 0) {
    console.log('[WisBot] docs/ folder is empty. Add .md or .txt files to provide context.');
    return { text: '', count: 0 };
  }

  const text = files.map(f => {
    const content = fs.readFileSync(path.join(docsDir, f), 'utf-8');
    return `--- Document: ${f} ---\n${content}`;
  }).join('\n\n');

  console.log(`[WisBot] Loaded ${files.length} document(s) (${text.length} characters)`);
  return { text, count: files.length };
}

const docs = loadDocuments();

// ---------------------------------------------------------------------------
// OpenAI Client
// ---------------------------------------------------------------------------
let openai = null;

if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-api-key-here') {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log('[WisBot] OpenAI client initialized.');
} else {
  console.log('[WisBot] WARNING: OPENAI_API_KEY not configured. Copy .env.example to .env and add your key.');
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Health / status check
app.get('/api/status', (req, res) => {
  res.json({
    apiKeyConfigured: !!openai,
    documentsLoaded: docs.count,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  if (!openai) {
    return res.status(500).json({
      error: 'API key not configured. Please add your OpenAI API key to the .env file and restart the server.',
    });
  }

  const { messages, language } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required.' });
  }

  // Language mapping
  const langMap = {
    en: 'English',
    sv: 'Swedish',
    de: 'German',
    zh: 'Simplified Chinese (Mandarin)',
    hi: 'Hindi',
  };
  const responseLang = langMap[language] || 'English';

  // Build system message with document context
  let systemContent = 'You are WisBot, a helpful documentation assistant. ' +
    `Always respond in ${responseLang}. `;

  if (docs.text) {
    systemContent +=
      'Answer questions based on the documentation provided below. ' +
      'The documentation may be in a different language than the user writes in - ' +
      `always translate your answer into ${responseLang}. ` +
      'If the answer is not found in the documentation, clearly state that. ' +
      'Be concise and helpful.\n\n' +
      docs.text;
  } else {
    systemContent +=
      'No documentation has been loaded yet. Let the user know they can add ' +
      '.md or .txt files to the docs/ folder and restart the server.';
  }

  const systemMessage = { role: 'system', content: systemContent };

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [systemMessage, ...messages],
      max_tokens: 1024,
    });

    res.json({ message: completion.choices[0].message });
  } catch (err) {
    console.error('[WisBot] OpenAI error:', err.message);

    if (err.status === 401) {
      return res.status(401).json({ error: 'Invalid API key. Please check your .env file.' });
    }

    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// ---------------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`[WisBot] Server running at http://localhost:${PORT}`);
});
