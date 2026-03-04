// ---------------------------------------------------------------------------
// WisBot Chat Panel - Frontend Logic
// ---------------------------------------------------------------------------

const panel = document.getElementById('chat-panel');
const toggleBtn = document.getElementById('chat-toggle');
const closeBtn = document.getElementById('chat-close');
const messagesEl = document.getElementById('chat-messages');
const inputEl = document.getElementById('chat-input');
const sendBtn = document.getElementById('chat-send');

// Conversation history sent to the backend with each request
const conversationHistory = [];

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
      body: JSON.stringify({ messages: conversationHistory }),
    });

    const data = await res.json();

    // Remove typing indicator
    typingEl.remove();

    if (!res.ok) {
      appendMessage('error', data.error || 'Something went wrong.');
      return;
    }

    const reply = data.message.content;
    conversationHistory.push({ role: 'assistant', content: reply });
    appendMessage('bot', reply);
  } catch (err) {
    typingEl.remove();
    appendMessage('error', 'Network error. Is the server running?');
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
      appendMessage('error',
        'API key not configured. Please add your OpenAI API key to the .env file and restart the server. See README.md for instructions.'
      );
    }
  } catch {
    // Server not reachable - will show error when user tries to send
  }
})();
