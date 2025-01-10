import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Message from './Message';



const ChatIcon = () => (
  <svg 
    className="w-6 h-6"
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.2423 2.76389 16.3114 4.07375 17.9877L2.9873 21.0123C2.75389 21.5547 3.31191 22.1127 3.85432 21.8793L6.87868 20.7929C8.55499 22.1027 10.6241 22.8666 12.8664 22.9813C12.5787 22.9937 12.2896 23 12 23V22Z" 
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path 
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.2423 2.76389 16.3114 4.07375 17.9877L2.9873 21.0123C2.75389 21.5547 3.31191 22.1127 3.85432 21.8793L6.87868 20.7929C8.55499 22.1027 10.6241 22.8666 12.8664 22.9813C12.5787 22.9937 12.2896 23 12 23"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function ChatInterface() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });
      // Save token or user data in localStorage or state
      localStorage.setItem('token', response.data.token);
      alert('Login Successful!');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
    if (!message.trim()) return;

    setMessages([...messages, { text: message, isUser: true }]);
    setLoading(true);

    try {
      setMessage("");
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: message
      });
      setMessages(prev => [...prev, { text: response.data.message, isUser: false }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { text: 'Error: Could not get response', isUser: false }]);
    }

    setLoading(false);
    setMessage('');
  };

  return (
    
    <>
       <div> <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
    </div>
    
      {/* Chat Toggle Button */}
      <button 
        className="fixed bottom-6 right-6 rounded-full bg-blue-500 p-4 text-white shadow-lg hover:bg-blue-600 transition-colors"
        onClick={() => setIsOpen(true)}
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <ChatIcon />
      </button>

      {/* Chat Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="bg-white rounded-lg w-full max-w-md h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChatIcon />
                <div>
                  <h1 className="font-bold text-lg">ChatWithMe</h1>
                  <p className="text-sm text-gray-500">Your friendly AI companion</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
      
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <Message key={index} text={msg.text} isUser={msg.isUser} />
              ))}
              {loading && (
                <div className="flex justify-center">
                  <div className="dot-pulse" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Message AI Assistant..."
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
        
      )}
    </>
  );
}

export default ChatInterface;