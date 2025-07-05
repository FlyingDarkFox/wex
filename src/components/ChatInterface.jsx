import { useState } from 'react';
import { Send, Trash2, Settings, MessageSquare } from 'lucide-react';
import { useAIChat } from '../hooks/useAIChat';
import { AI_PROVIDERS, PROVIDER_CONFIGS } from '../config/aiProviders';
import { ProviderSettings } from './ProviderSettings';
import { MessageList } from './MessageList';

export const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(AI_PROVIDERS.OPENAI);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [apiKeys, setApiKeys] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  
  const { messages, isLoading, error, sendMessage, clearMessages } = useAIChat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const apiKey = apiKeys[selectedProvider];
    if (PROVIDER_CONFIGS[selectedProvider].requiresKey && !apiKey) {
      alert(`Please set your ${PROVIDER_CONFIGS[selectedProvider].name} API key in settings.`);
      setShowSettings(true);
      return;
    }

    await sendMessage(input, selectedProvider, selectedModel, apiKey);
    setInput('');
  };

  const handleProviderChange = (provider) => {
    setSelectedProvider(provider);
    setSelectedModel(PROVIDER_CONFIGS[provider].models[0]);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Wify AI Chat</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={clearMessages}
              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-300"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Provider Selection */}
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(PROVIDER_CONFIGS).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleProviderChange(key)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                selectedProvider === key
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {config.name}
            </button>
          ))}
        </div>

        {/* Model Selection */}
        <div className="mt-2">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
          >
            {PROVIDER_CONFIGS[selectedProvider].models.map(model => (
              <option key={model} value={model} className="bg-slate-800">
                {model}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <ProviderSettings
          apiKeys={apiKeys}
          setApiKeys={setApiKeys}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Messages */}
      <MessageList messages={messages} isLoading={isLoading} error={error} />

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-white/5 backdrop-blur-md border-t border-white/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${PROVIDER_CONFIGS[selectedProvider].name}...`}
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};