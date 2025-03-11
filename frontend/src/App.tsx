import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:8080");

    websocket.onopen = () => {
      console.log("Connected to WebSocket server");
      websocket.send(
        JSON.stringify({
          type: "join",
          payload: { roomId: "1234" },
        })
      );
    };

    websocket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    wsRef.current = websocket;

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (wsRef.current && input.trim() !== "") {
      wsRef.current.send(JSON.stringify({ type: "chat", payload: { message: input } }));
      setInput("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Chat Container */}
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-4">
        <h1 className="text-2xl font-bold text-center text-blue-500 mb-4"> Chat Box</h1>

        {/* Messages List */}
        <div className="h-64 overflow-y-auto border rounded p-3 bg-gray-50 mb-4">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center">No messages yet...</p>
          ) : (
            <ul className="space-y-2">
              {messages.map((msg, index) => (
                <li key={index} className="bg-blue-100 p-2 rounded shadow">
                  {msg}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Input Field & Button */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;