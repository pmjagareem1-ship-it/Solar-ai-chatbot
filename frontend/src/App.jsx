import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState("New conversation");

  const suggestedQuestions = [
    "How do solar panels generate electricity?",
    "What is the best solar panel for a village?",
    "How much electricity can a 5kW system generate?",
    "How often do solar panels need maintenance?"
  ];

  const sendMessage = async (text = message) => {
    const finalMessage = text.trim();

    if (!finalMessage || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: finalMessage
      }
    ]);

    setMessage("");
    setLoading(true);
    setActiveChat("Solar conversation");

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: finalMessage
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: data.reply
        }
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Sorry, I couldn't connect to the AI server. Please make sure the backend is running."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setMessage("");
    setActiveChat("New conversation");
  };

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">☀</div>

          <div>
            <h2>SolarAI</h2>
            <span>Energy Assistant</span>
          </div>
        </div>

        <button className="new-chat-btn" onClick={startNewChat}>
          <span>＋</span>
          New conversation
        </button>

        <div className="sidebar-section">
          <p className="section-title">YOUR CHATS</p>

          <div className="chat-item active">
            <span>💬</span>
            <span>{activeChat}</span>
          </div>
        </div>

        <div className="sidebar-bottom">

          <div className="sidebar-link">
            <span>⚙</span>
            Settings
          </div>

          <div className="sidebar-link">
            <span>?</span>
            Help & Information
          </div>

          <div className="user-profile">
            <div className="avatar">U</div>

            <div>
              <strong>Solar User</strong>
              <small>Solar enthusiast</small>
            </div>

            <span className="more">•••</span>
          </div>

        </div>
      </aside>

      {/* MAIN */}
      <main className="main">

        {/* HEADER */}
        <header className="topbar">

          <div className="mobile-brand">
            <div className="brand-icon">☀</div>
            <strong>SolarAI</strong>
          </div>

          <div className="assistant-status">
            <div className="status-dot"></div>

            <div>
              <strong>Solar AI Assistant</strong>
              <span>Online • Solar knowledge assistant</span>
            </div>
          </div>

          <button className="top-action">
            ⋮
          </button>

        </header>

        {/* CHAT AREA */}
        <section className="chat-area">

          {messages.length === 0 ? (

            <div className="welcome">

              <div className="welcome-icon">
                ☀️
              </div>

              <span className="eyebrow">
                SOLAR ENERGY ASSISTANT
              </span>

              <h1>
                Your questions.
                <br />
                <span>Powered by the sun.</span>
              </h1>

              <p className="welcome-text">
                Ask me anything about solar panels, solar power plants,
                electricity generation, installation, maintenance and
                renewable energy.
              </p>

              <div className="suggestions">

                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="suggestion-card"
                    onClick={() => sendMessage(question)}
                  >
                    <span className="suggestion-icon">
                      {["⚡", "☀️", "📊", "🔧"][index]}
                    </span>

                    <span>{question}</span>

                    <span className="arrow">
                      →
                    </span>
                  </button>
                ))}

              </div>

            </div>

          ) : (

            <div className="messages">

              {messages.map((msg, index) => (

                <div
                  className={`message-row ${msg.type}`}
                  key={index}
                >

                  {msg.type === "bot" && (
                    <div className="bot-avatar">
                      ☀
                    </div>
                  )}

                  <div className="message-content">

                    <div className="message-name">
                      {msg.type === "bot" ? "SolarAI" : "You"}
                    </div>

                    <div className="message-bubble">
                      {msg.text}
                    </div>

                  </div>

                </div>

              ))}

              {loading && (
                <div className="message-row bot">

                  <div className="bot-avatar">
                    ☀
                  </div>

                  <div className="message-content">

                    <div className="message-name">
                      SolarAI
                    </div>

                    <div className="message-bubble typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                  </div>

                </div>
              )}

            </div>

          )}

        </section>

        {/* INPUT */}
        <div className="input-wrapper">

          <div className="input-box">

            <button className="attach-btn">
              ＋
            </button>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about solar energy..."
              rows="1"
              disabled={loading}
            />

            <button
              className={`send-btn ${message.trim() ? "ready" : ""}`}
              onClick={() => sendMessage()}
              disabled={loading}
            >
              ↑
            </button>

          </div>

          <div className="input-footer">
            <span>
              SolarAI can make mistakes. Verify important information.
            </span>

            <span>
              Press <b>Enter</b> to send
            </span>
          </div>

        </div>

      </main>

    </div>
  );
}

export default App;