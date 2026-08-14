'use client'

import { useState } from 'react'
import { useAIChat } from '@/hooks/useAI'
import { Button } from '@/components/ui/button'

export default function TutorPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI Investment Tutor. I'm here to help you learn about investing. What would you like to know?",
    },
  ])
  const [input, setInput] = useState('')
  const chatMutation = useAIChat()

  const handleSend = async () => {
    if (!input.trim() || chatMutation.isPending) return

    const userMessage = input
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])

    try {
      const response = await chatMutation.mutateAsync({
        message: userMessage,
        conversationHistory: messages,
        userLevel: 'beginner',
      })

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.data.response || 'Sorry, I could not generate a response.',
        },
      ])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ])
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Investment Tutor
            </h1>
            <p className="text-xl text-gray-600">
              Ask questions and get personalized explanations
            </p>
          </div>

          {/* Suggested Questions */}
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Try asking:
            </p>
            <div className="flex flex-wrap gap-2">
              <SuggestedQuestion text="What is a P/E ratio?" onClick={handleSuggestedQuestion} />
              <SuggestedQuestion text="Explain dividends" onClick={handleSuggestedQuestion} />
              <SuggestedQuestion text="How do I diversify?" onClick={handleSuggestedQuestion} />
              <SuggestedQuestion text="What is market cap?" onClick={handleSuggestedQuestion} />
            </div>
          </div>

          {/* Chat Messages */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-4 min-h-[500px] max-h-[500px] overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Ask a question about investing..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button size="lg" onClick={handleSend} disabled={chatMutation.isPending}>
              {chatMutation.isPending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SuggestedQuestion({ text, onClick }: { text: string; onClick: (text: string) => void }) {
  return (
    <button
      onClick={() => onClick(text)}
      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
    >
      {text}
    </button>
  )
}
