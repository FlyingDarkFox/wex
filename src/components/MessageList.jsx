import { Bot, User, AlertCircle, MessageSquare } from 'lucide-react';
import { PROVIDER_CONFIGS } from '../config/aiProviders';

export const MessageList = ({ messages, isLoading, error }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && !isLoading && (
        <div className="text-center text-white/60 mt-20">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Welcome to Wify AI</h3>
          <p>Choose an AI provider and start chatting!</p>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.role === 'assistant' && (
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
          )}
          
          <div
            className={`max-w-[70%] rounded-2xl px-4 py-3 ${
              message.role === 'user'
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-white border border-white/20'
            }`}
          >
            <div className="whitespace-pre-wrap">{message.content}</div>
            {message.role === 'assistant' && message.provider && (
              <div className="text-xs text-white/50 mt-2">
                {PROVIDER_CONFIGS[message.provider]?.name} • {message.model}
              </div>
            )}
          </div>

          {message.role === 'user' && (
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-3 justify-start">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};