// ---------------------------------------------------------------------------
// WisBot Chat Panel - Frontend Logic
// ---------------------------------------------------------------------------

const panel = document.getElementById('chat-panel');
const toggleBtn = document.getElementById('chat-toggle');
const closeBtn = document.getElementById('chat-close');
const messagesEl = document.getElementById('chat-messages');
const inputEl = document.getElementById('chat-input');
const sendBtn = document.getElementById('chat-send');
const langSelect = document.getElementById('lang-select');

// Conversation history sent to the backend with each request
const conversationHistory = [];

// ---------------------------------------------------------------------------
// Translations
// ---------------------------------------------------------------------------
const translations = {
  en: {
    welcomeTitle: 'AI Documentation Assistant Demo',
    welcomeDesc: 'This is a proof-of-concept demonstrating how an AI chatbot can help users find information from product documentation without manually searching through files.',
    howTitle: 'How it works',
    howList: [
      'Documentation files are loaded from the <code>docs/</code> folder on the server',
      'The AI assistant uses these documents to answer your questions',
      'Click the <strong>chat icon</strong> in the top-right corner to start a conversation',
    ],
    tryTitle: 'Try asking',
    tryList: [
      '"How do I select different tyres for the truck and trailer?"',
      '"What weight limits does the validation engine check?"',
      '"How do I compare two configurations?"',
    ],
    chatTitle: 'WisBot AI Assistant',
    chatWelcome: "Hello! I'm WisBot, your documentation assistant. Ask me anything about the platform.",
    inputPlaceholder: 'Ask me anything!',
    sendTitle: 'Send',
    closeTitle: 'Close',
    toggleTitle: 'Open AI Assistant',
    langTitle: 'Response language',
    networkError: 'Network error. Is the server running?',
    fallbackError: 'Something went wrong.',
    apiKeyError: 'API key not configured. Please add your OpenAI API key to the .env file and restart the server. See README.md for instructions.',
  },
  sv: {
    welcomeTitle: 'AI Dokumentationsassistent Demo',
    welcomeDesc: 'Detta \u00e4r ett proof-of-concept som visar hur en AI-chatbot kan hj\u00e4lpa anv\u00e4ndare att hitta information fr\u00e5n produktdokumentation utan att manuellt s\u00f6ka igenom filer.',
    howTitle: 'S\u00e5 fungerar det',
    howList: [
      'Dokumentationsfiler laddas fr\u00e5n mappen <code>docs/</code> p\u00e5 servern',
      'AI-assistenten anv\u00e4nder dessa dokument f\u00f6r att svara p\u00e5 dina fr\u00e5gor',
      'Klicka p\u00e5 <strong>chattikonen</strong> uppe till h\u00f6ger f\u00f6r att starta en konversation',
    ],
    tryTitle: 'Testa att fr\u00e5ga',
    tryList: [
      '"Hur v\u00e4ljer jag olika d\u00e4ck f\u00f6r lastbil och sl\u00e4p?"',
      '"Vilka viktgr\u00e4nser kontrollerar valideringsmotorn?"',
      '"Hur j\u00e4mf\u00f6r jag tv\u00e5 konfigurationer?"',
    ],
    chatTitle: 'WisBot AI-assistent',
    chatWelcome: 'Hej! Jag \u00e4r WisBot, din dokumentationsassistent. Fr\u00e5ga mig vad som helst om plattformen.',
    inputPlaceholder: 'Fr\u00e5ga mig vad som helst!',
    sendTitle: 'Skicka',
    closeTitle: 'St\u00e4ng',
    toggleTitle: '\u00d6ppna AI-assistent',
    langTitle: 'Spr\u00e5k f\u00f6r svar',
    networkError: 'N\u00e4tverksfel. K\u00f6rs servern?',
    fallbackError: 'N\u00e5got gick fel.',
    apiKeyError: 'API-nyckel saknas. L\u00e4gg till din OpenAI API-nyckel i .env-filen och starta om servern. Se README.md f\u00f6r instruktioner.',
  },
  de: {
    welcomeTitle: 'KI-Dokumentationsassistent Demo',
    welcomeDesc: 'Dies ist ein Proof-of-Concept, das zeigt, wie ein KI-Chatbot Benutzern helfen kann, Informationen aus der Produktdokumentation zu finden, ohne manuell durch Dateien suchen zu m\u00fcssen.',
    howTitle: 'So funktioniert es',
    howList: [
      'Dokumentationsdateien werden aus dem Ordner <code>docs/</code> auf dem Server geladen',
      'Der KI-Assistent nutzt diese Dokumente, um Ihre Fragen zu beantworten',
      'Klicken Sie auf das <strong>Chat-Symbol</strong> oben rechts, um ein Gespr\u00e4ch zu starten',
    ],
    tryTitle: 'Probieren Sie zu fragen',
    tryList: [
      '"Wie w\u00e4hle ich verschiedene Reifen f\u00fcr LKW und Anh\u00e4nger aus?"',
      '"Welche Gewichtsgrenzen pr\u00fcft die Validierungsengine?"',
      '"Wie vergleiche ich zwei Konfigurationen?"',
    ],
    chatTitle: 'WisBot KI-Assistent',
    chatWelcome: 'Hallo! Ich bin WisBot, Ihr Dokumentationsassistent. Fragen Sie mich alles \u00fcber die Plattform.',
    inputPlaceholder: 'Fragen Sie mich etwas!',
    sendTitle: 'Senden',
    closeTitle: 'Schlie\u00dfen',
    toggleTitle: 'KI-Assistent \u00f6ffnen',
    langTitle: 'Antwortsprache',
    networkError: 'Netzwerkfehler. L\u00e4uft der Server?',
    fallbackError: 'Etwas ist schiefgelaufen.',
    apiKeyError: 'API-Schl\u00fcssel nicht konfiguriert. Bitte f\u00fcgen Sie Ihren OpenAI-API-Schl\u00fcssel in die .env-Datei ein und starten Sie den Server neu. Siehe README.md.',
  },
  zh: {
    welcomeTitle: 'AI \u6587\u6863\u52a9\u624b\u6f14\u793a',
    welcomeDesc: '\u8fd9\u662f\u4e00\u4e2a\u6982\u5ff5\u9a8c\u8bc1\uff0c\u5c55\u793a\u4e86 AI \u804a\u5929\u673a\u5668\u4eba\u5982\u4f55\u5e2e\u52a9\u7528\u6237\u4ece\u4ea7\u54c1\u6587\u6863\u4e2d\u67e5\u627e\u4fe1\u606f\uff0c\u65e0\u9700\u624b\u52a8\u641c\u7d22\u6587\u4ef6\u3002',
    howTitle: '\u5de5\u4f5c\u539f\u7406',
    howList: [
      '\u6587\u6863\u6587\u4ef6\u4ece\u670d\u52a1\u5668\u7684 <code>docs/</code> \u6587\u4ef6\u5939\u52a0\u8f7d',
      'AI \u52a9\u624b\u4f7f\u7528\u8fd9\u4e9b\u6587\u6863\u6765\u56de\u7b54\u60a8\u7684\u95ee\u9898',
      '\u70b9\u51fb\u53f3\u4e0a\u89d2\u7684<strong>\u804a\u5929\u56fe\u6807</strong>\u5f00\u59cb\u5bf9\u8bdd',
    ],
    tryTitle: '\u8bd5\u7740\u95ee',
    tryList: [
      '"\u5982\u4f55\u4e3a\u5361\u8f66\u548c\u62d6\u8f66\u9009\u62e9\u4e0d\u540c\u7684\u8f6e\u80ce\uff1f"',
      '"\u9a8c\u8bc1\u5f15\u64ce\u68c0\u67e5\u54ea\u4e9b\u91cd\u91cf\u9650\u5236\uff1f"',
      '"\u5982\u4f55\u6bd4\u8f83\u4e24\u4e2a\u914d\u7f6e\uff1f"',
    ],
    chatTitle: 'WisBot AI \u52a9\u624b',
    chatWelcome: '\u60a8\u597d\uff01\u6211\u662f WisBot\uff0c\u60a8\u7684\u6587\u6863\u52a9\u624b\u3002\u8bf7\u968f\u65f6\u5411\u6211\u63d0\u95ee\u5173\u4e8e\u5e73\u53f0\u7684\u4efb\u4f55\u95ee\u9898\u3002',
    inputPlaceholder: '\u968f\u4fbf\u95ee\u6211\uff01',
    sendTitle: '\u53d1\u9001',
    closeTitle: '\u5173\u95ed',
    toggleTitle: '\u6253\u5f00 AI \u52a9\u624b',
    langTitle: '\u56de\u7b54\u8bed\u8a00',
    networkError: '\u7f51\u7edc\u9519\u8bef\u3002\u670d\u52a1\u5668\u662f\u5426\u6b63\u5728\u8fd0\u884c\uff1f',
    fallbackError: '\u51fa\u4e86\u70b9\u95ee\u9898\u3002',
    apiKeyError: 'API \u5bc6\u94a5\u672a\u914d\u7f6e\u3002\u8bf7\u5c06\u60a8\u7684 OpenAI API \u5bc6\u94a5\u6dfb\u52a0\u5230 .env \u6587\u4ef6\u5e76\u91cd\u65b0\u542f\u52a8\u670d\u52a1\u5668\u3002\u8bf7\u53c2\u9605 README.md\u3002',
  },
};

function t(key) {
  const lang = langSelect.value || 'en';
  return (translations[lang] && translations[lang][key]) || translations.en[key];
}

// ---------------------------------------------------------------------------
// Apply translations to the entire UI
// ---------------------------------------------------------------------------
function applyLanguage() {
  const lang = langSelect.value || 'en';
  const tr = translations[lang] || translations.en;

  // Welcome card
  document.getElementById('welcome-title').textContent = tr.welcomeTitle;
  document.getElementById('welcome-desc').textContent = tr.welcomeDesc;
  document.getElementById('how-title').textContent = tr.howTitle;
  document.getElementById('how-list').innerHTML = tr.howList.map(li => `<li>${li}</li>`).join('');
  document.getElementById('try-title').textContent = tr.tryTitle;
  document.getElementById('try-list').innerHTML = tr.tryList.map(li => `<li>${li}</li>`).join('');

  // Chat panel
  document.getElementById('chat-title-text').textContent = tr.chatTitle;
  document.getElementById('chat-welcome-text').textContent = tr.chatWelcome;
  inputEl.placeholder = tr.inputPlaceholder;
  sendBtn.title = tr.sendTitle;
  closeBtn.title = tr.closeTitle;
  toggleBtn.title = tr.toggleTitle;
  langSelect.title = tr.langTitle;
}

// Listen for language change
langSelect.addEventListener('change', applyLanguage);

// ---------------------------------------------------------------------------
// Panel toggle
// ---------------------------------------------------------------------------
toggleBtn.addEventListener('click', () => {
  panel.classList.toggle('hidden');
  if (!panel.classList.contains('hidden')) {
    inputEl.focus();
  }
});

closeBtn.addEventListener('click', () => {
  panel.classList.add('hidden');
});

// ---------------------------------------------------------------------------
// Send message
// ---------------------------------------------------------------------------
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendBtn.addEventListener('click', sendMessage);

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;

  // Add user message to UI and history
  appendMessage('user', text);
  conversationHistory.push({ role: 'user', content: text });
  inputEl.value = '';
  inputEl.focus();

  // Disable input while waiting
  setInputEnabled(false);

  // Show typing indicator
  const typingEl = showTypingIndicator();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversationHistory, language: langSelect.value }),
    });

    const data = await res.json();

    // Remove typing indicator
    typingEl.remove();

    if (!res.ok) {
      appendMessage('error', data.error || t('fallbackError'));
      return;
    }

    const reply = data.message.content;
    conversationHistory.push({ role: 'assistant', content: reply });
    appendMessage('bot', reply);
  } catch (err) {
    typingEl.remove();
    appendMessage('error', t('networkError'));
  } finally {
    setInputEnabled(true);
    inputEl.focus();
  }
}

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------
function appendMessage(role, content) {
  const wrapper = document.createElement('div');

  if (role === 'user') {
    wrapper.className = 'message user-message';
    wrapper.innerHTML = `<div class="message-content">${escapeHtml(content)}</div>`;
  } else if (role === 'bot') {
    wrapper.className = 'message bot-message';
    wrapper.innerHTML = `<div class="message-content">${renderMarkdown(content)}</div>`;
  } else if (role === 'error') {
    wrapper.className = 'message bot-message error-message';
    wrapper.innerHTML = `<div class="message-content">${escapeHtml(content)}</div>`;
  }

  messagesEl.appendChild(wrapper);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showTypingIndicator() {
  const el = document.createElement('div');
  el.className = 'message bot-message';
  el.innerHTML = `
    <div class="typing-indicator">
      <span></span><span></span><span></span>
    </div>
  `;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return el;
}

function setInputEnabled(enabled) {
  inputEl.disabled = !enabled;
  sendBtn.disabled = !enabled;
}

// ---------------------------------------------------------------------------
// Simple markdown rendering (bold, code, lists, line breaks)
// ---------------------------------------------------------------------------
function renderMarkdown(text) {
  let html = escapeHtml(text);

  // Code blocks (``` ... ```)
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Unordered lists (lines starting with - or *)
  html = html.replace(/^[-*] (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Numbered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Line breaks
  html = html.replace(/\n/g, '<br>');

  // Clean up <br> inside <ul>
  html = html.replace(/<br><\/ul>/g, '</ul>');
  html = html.replace(/<ul><br>/g, '<ul>');
  html = html.replace(/<\/li><br><li>/g, '</li><li>');

  return html;
}

function escapeHtml(text) {
  const el = document.createElement('div');
  el.textContent = text;
  return el.innerHTML;
}

// ---------------------------------------------------------------------------
// Check API status on load
// ---------------------------------------------------------------------------
(async function checkStatus() {
  try {
    const res = await fetch('/api/status');
    const data = await res.json();

    if (!data.apiKeyConfigured) {
      appendMessage('error', t('apiKeyError'));
    }
  } catch {
    // Server not reachable - will show error when user tries to send
  }
})();
