import { useRef } from "react";
import { IoMdSend } from "react-icons/io";

import "./ChatForm.css";

interface ChatFormProps {
  chatHistory: { role: string; text: string }[];
  setChatHistory: (history: { role: string; text: string }[]) => void;
  generateBotResponse: (history: { role: string; text: string }[]) => void;
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
    setChatHistory((history: { role: string; text: string }[]) => [
      ...history,
      { role: "user", text: userMessage },
    ]);

    // Delay 600 ms before showing "Thinking..." and generating response
    setTimeout(() => {
      setChatHistory((history: { role: string; text: string }[]) => [
        ...history,
        { role: "model", text: "Thinking..." },
      ]);

      generateBotResponse([
        ...chatHistory,
        {
          role: "user",
          text: `Using the details provided above, please address this query: ${userMessage}`,
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
