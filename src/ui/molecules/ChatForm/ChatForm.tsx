import { useRef } from "react";
import { IoMdSend } from "react-icons/io";
import type { ChatHistory } from "../../../App";

import "./ChatForm.css";

interface ChatFormProps {
  chatHistory: ChatHistory[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatHistory[]>>;
  generateBotResponse: (history: ChatHistory[]) => void;
}

const ChatForm = ({
  chatHistory,
  setChatHistory,
  generateBotResponse,
}: ChatFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessage = inputRef.current?.value.trim();
    if (!userMessage) return;

    inputRef.current!.value = "";
    setChatHistory((history: ChatHistory[]) => [
      ...history,
      { role: "user", text: userMessage, hideInChat: false },
    ]);

    // Delay 600 ms before showing "Thinking..." and generating response
    setTimeout(() => {
      setChatHistory((history: ChatHistory[]) => [
        ...history,
        { role: "model", text: "...", hideInChat: false },
      ]);

      generateBotResponse([
        ...chatHistory,
        {
          role: "user",
          text: `Using the details provided above, please address this query: ${userMessage}`,
          hideInChat: false,
        },
      ]);
    }, 600);
  };

  return (
    <form onSubmit={handleFormSubmit} className="chat-form">
      <input
        ref={inputRef}
        placeholder="Message..."
        className="message-input"
        required
      />
      <button type="submit" id="send-message">
        <IoMdSend />
      </button>
    </form>
  );
};
export default ChatForm;
