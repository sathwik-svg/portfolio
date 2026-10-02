(function () {
  const WEBHOOK_URL = "http://192.168.204.130:5678/webhook-test/portfolio-ai";

  const button = document.createElement("button");
  button.id = "ai-assistant-button";
  button.setAttribute("aria-label", "Open AI Assistant");
  button.innerHTML = "🤖";

  const windowBox = document.createElement("div");
  windowBox.id = "ai-assistant-window";

  windowBox.innerHTML = `
    <div class="ai-header">
      <div class="ai-title">
        <span class="ai-icon">🤖</span>
        <div>
          <strong>Portfolio AI</strong>
          <span class="ai-status">Sathwik's AI Assistant</span>
        </div>
      </div>
      <button class="ai-close" aria-label="Close">×</button>
    </div>

    <div class="ai-messages" id="ai-messages">
      <div class="ai-message bot">
        Hi! 👋 I'm Sathwik's portfolio AI assistant.
        Ask me about his projects, Cloud & DevOps skills, technologies, or portfolio.
      </div>
    </div>

    <div class="ai-input-area">
      <input
        id="ai-assistant-input"
        type="text"
        placeholder="Ask me something..."
        autocomplete="off"
      />
      <button id="ai-assistant-send" aria-label="Send">➤</button>
    </div>
  `;

  document.body.appendChild(button);
  document.body.appendChild(windowBox);

  const messages = document.getElementById("ai-messages");
  const input = document.getElementById("ai-assistant-input");
  const send = document.getElementById("ai-assistant-send");
  const close = windowBox.querySelector(".ai-close");

  button.addEventListener("click", () => {
    windowBox.classList.toggle("ai-open");
    if (windowBox.classList.contains("ai-open")) {
      input.focus();
    }
  });

  close.addEventListener("click", () => {
    windowBox.classList.remove("ai-open");
  });

  function addMessage(text, type) {
    const message = document.createElement("div");
    message.className = `ai-message ${type}`;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  }

  async function sendMessage() {
    const message = input.value.trim();

    if (!message || send.disabled) {
      return;
    }

    addMessage(message, "user");
    input.value = "";
    send.disabled = true;

    const typing = addMessage("Thinking... 🤔", "bot");
    typing.classList.add("ai-typing");

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          localTime: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      typing.remove();

      addMessage(
        data.reply || "I couldn't generate a response right now.",
        "bot"
      );

    } catch (error) {
      typing.remove();

      addMessage(
        "Sorry, I couldn't connect to the AI assistant right now. Please try again shortly.",
        "bot"
      );

      console.error("Portfolio AI error:", error);
    } finally {
      send.disabled = false;
      input.focus();
    }
  }

  send.addEventListener("click", sendMessage);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
})();
