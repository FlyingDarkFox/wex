import { useState } from 'react';
import { X, Key, ExternalLink } from 'lucide-react';
import { AI_PROVIDERS, PROVIDER_CONFIGS } from '../config/aiProviders';

export const ProviderSettings = ({ apiKeys, setApiKeys, onClose }) => {
  const [tempKeys, setTempKeys] = useState(apiKeys);

  const handleSave = () => {
    setApiKeys(tempKeys);
    onClose();
  };

  const getApiKeyUrl = (provider) => {
    const urls = {
      [AI_PROVIDERS.OPENAI]: 'https://platform.openai.com/api-keys',
      [AI_PROVIDERS.GEMINI]: 'https://makersuite.google.com/app/apikey',
      [AI_PROVIDERS.GROQ]: 'https://console.groq.com/keys',
      [AI_PROVIDERS.HUGGINGFACE]: 'https://huggingface.co/settings/tokens',
      [AI_PROVIDERS.MISTRAL]: 'https://console.mistral.ai/api-keys/',
      [AI_PROVIDERS.TOGETHER]: 'https://api.together.xyz/settings/api-keys'
    };
    return urls[provider];
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Key className="w-5 h-5" />
          API Settings
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(PROVIDER_CONFIGS).map(([key, config]) => {
          if (!config.requiresKey) return null;
          
          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">
                  {config.name} API Key
                </label>
                <a
                  href={getApiKeyUrl(key)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1"
                >
                  Get Key <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                value={tempKeys[key] || ''}
                onChange={(e) => setTempKeys(prev => ({ ...prev, [key]: e.target.value }))}
                placeholder={`Enter ${config.name} API key...`}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
        <p className="text-blue-300 text-sm">
          <strong>Note:</strong> API keys are stored locally in your browser and never sent to our servers. 
          For Ollama, make sure it's running locally on port 11434.
        </p>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-colors"
        >
          Save Keys
        </button>
      </div>
    </div>
  );
};