import { useEffect, useRef, useState } from "react";
import ChatForm from "./ui/molecules/ChatForm/ChatForm";
import { chatBotContext } from "./chatBotContext";
import { LuDog } from "react-icons/lu";
import ChatMessage from "./ui/molecules/ChatMessage/ChatMessage";
import { BsChatRightTextFill } from "react-icons/bs";
import { FaArrowDown } from "react-icons/fa";

import "./App.css";

const App = () => {
  const chatBodyRef = useRef(null);
  const [showChatbot, setShowChatbot] = useState(true);
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: chatBotContext,
    },
  ]);

  const generateBotResponse = async (history) => {
    // Helper function to update chat history
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text != "Thinking..."),
        { role: "model", text, isError },
      ]);
    };

    // Format chat history for API request
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      // Make the API call to get the bot's response
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data?.error.message || "Something went wrong!");

      // Clean and update chat history with bot's response
      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updateHistory(apiResponseText);
    } catch (error) {
      // Update chat history with the error message
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    // Auto-scroll whenever chat history updates
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button
        onClick={() => setShowChatbot((prev) => !prev)}
        id="chatbot-toggler"
      >
        <BsChatRightTextFill className="text-[#7D94A0​] w-6 h-6 cursor-pointer hover:text-[#00558F]" />
      </button>

      <div className="chatbot-popup">
        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <LuDog className="text-amber-400 w-6 h-6" />
            <h2 className="logo-text">Chateo</h2>
          </div>
          <button onClick={() => setShowChatbot((prev) => !prev)}>
            <FaArrowDown className="text-white w-6 h-6 cursor-pointer hover:text-amber-300" />
          </button>
        </div>
        {/* Chatbot Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <LuDog className="text-amber-400 w-6 h-6" />
            <p className="message-text">
              ¡Hola! Soy el chatbot oficial de la Universidad de Bogotá Jorge
              Tadeo Lozano (UTADEO). Estoy aquí para ayudarte con cualquier
              información relacionada con nuestra universidad.
            </p>
          </div>
          {/* Render the chat history dynamically */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>
        {/* Chatbot Footer */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
