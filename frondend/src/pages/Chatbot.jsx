import React, { useState } from 'react';
import { SendHorizonal } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi there! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const GEMINI_API_KEY = 'AIzaSyD5Q0XskBN6G1h_BEFSZvF18sKr77g5JZ8'; // move this to backend in production
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { type: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: input }],
            },
          ],
        }),
      });

      const data = await response.json();
      const botReply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand that.";

      setMessages((prev) => [...prev, { type: 'bot', text: botReply }]);
    } catch (error) {
      console.error('Gemini API error:', error);
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: 'Oops! Something went wrong.' },
      ]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">VetDoctors Chat Assistant</h2>
      <div className="h-96 overflow-y-auto p-4 border rounded-md bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 p-3 rounded-lg w-fit max-w-[80%] ${
              msg.type === 'bot' ? 'bg-blue-100 text-left' : 'bg-green-100 ml-auto text-right'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex items-center mt-4">
        <input
          type="text"
          className="flex-1 border rounded-md px-3 py-2 mr-2"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <SendHorizonal size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
