"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Bot, Loader2, MessageCircle, X, MapPin, Star, DollarSign } from "lucide-react"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const AIChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hi! I'm your WanderRift travel assistant. I can help you explore trips, destinations, reviews, and more. Try asking: 'Show me trips to Tokyo' or 'What are the most popular destinations?'`,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputMessage }),
      })

      const data = await response.json()

      const botMessage: Message = {
        id: Date.now() + 1,
        text: data.response || "Sorry, I encountered an error processing your request.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const quickQuestions = [
    { icon: MapPin, text: "Show me all destinations", query: "What destinations are available?" },
    { icon: DollarSign, text: "Cheapest trips", query: "Show me the cheapest trips" },
    { icon: Star, text: "Highest rated trips", query: "What are the highest rated trips?" },
    { icon: MessageCircle, text: "Recent reviews", query: "Show me recent reviews" },
  ]

  const handleQuickQuestion = (query: string) => {
    setInputMessage(query)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group relative"
          aria-label="Open WanderRift AI Assistant"
        >
          <Bot size={24} className="group-hover:animate-pulse" />
          {/* Pulse animation for attention */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-ping opacity-30"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-96 h-[500px] flex flex-col border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-semibold">WanderRift Assistant</h3>
                <p className="text-xs text-blue-100">Trip Now, Regret Never</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-white text-gray-800 shadow-sm border"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Bot size={14} className="text-blue-600" />
                      <span className="text-xs text-gray-500 font-medium">WanderRift AI</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${message.sender === "user" ? "text-blue-100" : "text-gray-400"}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl shadow-sm border max-w-[85%]">
                  <div className="flex items-center space-x-3">
                    <Bot size={14} className="text-blue-600" />
                    <Loader2 size={14} className="animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Searching your trips...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t bg-white">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question.query)}
                    className="flex items-center space-x-2 p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <question.icon size={12} className="text-gray-500" />
                    <span className="text-gray-700 truncate">{question.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t bg-white p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about trips, destinations, prices..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white p-3 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIChatAssistant
