import { LuDog } from "react-icons/lu";

import "./ChatMessage.css";

interface ChatMessageProps {
  chat: {
    role: string;
    text: string;
    isError: boolean;
    hideInChat: boolean;
  };
}

const ChatMessage = ({ chat }: ChatMessageProps) => {
  return (
    !chat.hideInChat && (
      <div
        className={`message ${chat.role === "model" ? "bot" : "user"}-message ${
          chat.isError ? "error" : ""
        }`}
      >
        {chat.role === "model" && <LuDog className="text-amber-400 w-6 h-6" />}
        <p className="message-text">{chat.text}</p>
      </div>
    )
  );
};
export default ChatMessage;
