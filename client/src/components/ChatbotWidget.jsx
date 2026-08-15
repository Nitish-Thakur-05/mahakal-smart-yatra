import React, { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle, Loader2 } from "lucide-react";
import axios from "axios";

const PROMPT_BATCHES = [
  [
    "Tell me about Bhasma Aarti timings and passes",
    "What is the significance of Shri Mahakal Lok Corridor?",
    "Which shrines to visit near Mahakal Temple in Ujjain?",
  ],
  [
    "How to book a stay near Mahakal Temple Gate 1?",
    "What rituals are performed at Kal Bhairav Temple?",
    "Tell me about Harsiddhi Mata Shaktipeeth deepstambha",
  ],
  [
    "What is the historical background of Mangalnath Temple?",
    "Guide me through a 2-day Ujjain pilgrimage route",
    "When does Nagchandreshwar shrine open in a year?",
  ],
];

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPromptBatch, setCurrentPromptBatch] = useState(0);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Listen for open-chatbot custom event
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-chatbot", handleOpen);
    return () => window.removeEventListener("open-chatbot", handleOpen);
  }, []);

  // Rotate prompts every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromptBatch((prev) => (prev + 1) % PROMPT_BATCHES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (messageContent = inputValue) => {
    if (!messageContent.trim()) return;

    const userMessage = {
      id: `${Date.now()}-user`,
      type: "user",
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await axios.post("/api/chat-bot", {
        message: messageContent,
        conversationHistory: messages,
      });

      const assistantMessage = {
        id: `${Date.now()}-assistant`,
        type: "assistant",
        content: res.data.reply || res.data.response || "Unable to process request.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: `${Date.now()}-error`,
        type: "assistant",
        content: "Daily Bhasma Aarti starts at 04:00 AM. Temple is open 04:00 AM to 11:00 PM daily.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentPrompts = PROMPT_BATCHES[currentPromptBatch];

  return (
    <>
      {/* Floating Chat Button (Mahakalaswar Style) */}
      {!isOpen && (
        <div className="position-fixed bottom-0 end-0 m-4 z-50" style={{ zIndex: 1050 }}>
          <button
            onClick={() => setIsOpen(true)}
            className="btn btn-warning rounded-circle p-3 shadow-lg d-flex align-items-center justify-content-center transition-all hover-scale"
            style={{ width: 58, height: 58, background: '#fbbf24', color: '#000' }}
            title="Ask Mahakal AI Guide"
          >
            <MessageCircle size={28} className="fw-bold text-dark" />
          </button>
        </div>
      )}

      {/* Chat Modal (Mahakalaswar Style) */}
      {isOpen && (
        <div 
          className="chatbot-modal-container position-fixed bottom-0 end-0 m-3 m-md-4 shadow-lg d-flex flex-column rounded-4 overflow-hidden border border-warning border-opacity-30"
          style={{ width: '360px', height: '540px', backgroundColor: '#0a0a0a', zIndex: 1060 }}
        >
          {/* Header */}
          <div className="p-3 bg-warning text-dark d-flex align-items-center justify-content-between">
            <div>
              <h5 className="mb-0 fw-bold fst-italic text-dark">Mahakal360 Guide</h5>
              <small className="text-dark opacity-75 d-block" style={{ fontSize: '0.72rem' }}>
                Your AI companion for Mahakal Temple exploration
              </small>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-link text-dark p-1 text-decoration-none"
            >
              <X size={24} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="chatbot-messages-body flex-grow-1 overflow-y-auto p-3 d-flex flex-column gap-3">
            {messages.length === 0 ? (
              <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center p-3">
                <div className="rounded-circle bg-warning bg-opacity-10 p-3 mb-3 border border-warning border-opacity-25">
                  <MessageCircle className="text-warning" size={32} />
                </div>
                <h6 className="text-white fw-bold mb-2">Welcome to Mahakal360</h6>
                <p className="text-secondary small mb-0 max-w-xs" style={{ fontSize: '0.8rem' }}>
                  Ask me anything about Bhasma Aarti, Mahakal Lok corridor, temples, or stays in Ujjain.
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`d-flex ${msg.type === "user" ? "justify-content-end" : "justify-start"}`}
                  >
                    <div
                      className={`p-3 rounded-4 small ${
                        msg.type === "user"
                          ? "bg-warning text-dark fw-semibold"
                          : "bg-dark text-light border border-secondary border-opacity-25"
                      }`}
                      style={{ maxWidth: '82%', fontSize: '0.85rem' }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="d-flex justify-content-start">
                    <div className="p-2 px-3 bg-dark text-warning rounded-4 border border-secondary border-opacity-25 d-flex align-items-center gap-2 small">
                      <Loader2 size={16} className="spinner-border spinner-border-sm" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Quick Prompts */}
          {messages.length === 0 && (
            <div className="p-3 bg-dark border-top border-secondary border-opacity-25">
              <p className="text-warning text-uppercase fw-semibold tracking-wider mb-2" style={{ fontSize: '0.68rem' }}>
                Quick Questions
              </p>
              <div className="d-flex flex-column gap-1.5">
                {currentPrompts.map((prompt, idx) => (
                  <button
                    key={`${currentPromptBatch}-${idx}`}
                    onClick={() => sendMessage(prompt)}
                    disabled={isLoading}
                    className="btn btn-outline-secondary btn-sm text-start text-light border-opacity-25 py-1.5 px-2.5 rounded-3 text-truncate"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-black border-top border-secondary border-opacity-25">
            <div className="input-group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    sendMessage();
                  }
                }}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="form-control bg-dark text-white border-secondary border-opacity-50 small"
                style={{ fontSize: '0.85rem' }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !inputValue.trim()}
                className="btn btn-warning text-dark font-bold"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="chatbot-backdrop-overlay position-fixed top-0 start-0 w-100 h-100"
          style={{
            zIndex: 1055,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        />
      )}
    </>
  );
}
