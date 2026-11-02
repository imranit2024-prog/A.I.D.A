import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  CornerDownLeft,
  Mic,
  RefreshCw,
  Send,
  Trash2,
  Volume2,
  X,
} from 'lucide-react';
import { AIModel, AIModelId, ChatMessage } from '../types';
import { AI_MODELS } from '../data/models';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeModel: AIModel;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onSpeakMessage: (text: string, model: AIModel) => void;
  onSwitchModel: (id: AIModelId) => void;
  onClearMessages: () => void;
  onStartVoice: () => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  activeModel,
  messages,
  onSendMessage,
  isLoading,
  onSpeakMessage,
  onSwitchModel,
  onClearMessages,
  onStartVoice,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <aside className="fixed top-0 right-0 bottom-0 z-40 w-full sm:w-[480px] flex flex-col bg-slate-950/95 border-l border-slate-800/90 shadow-2xl backdrop-blur-xl transition-all">
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: activeModel.accentColor }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                {activeModel.name}
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {activeModel.role.split(' ')[0]}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[240px]">
              {activeModel.specialization}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onClearMessages}
            aria-label="Clear active conversation"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-all"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            aria-label="Close Chat Panel"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-all"
            title="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center border"
              style={{
                backgroundColor: `${activeModel.accentColor}15`,
                borderColor: `${activeModel.accentColor}40`,
              }}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: activeModel.accentColor }}
              />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">
                Conversation with {activeModel.name}
              </h4>
              <p className="text-xs text-slate-400 max-w-xs">
                {activeModel.description}
              </p>
            </div>
            <div className="pt-3 w-full space-y-1.5">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Suggested Prompts
              </p>
              {activeModel.suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(prompt)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-all truncate"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const msgModel = AI_MODELS.find((m) => m.id === msg.modelId) || activeModel;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                {/* Sender Tag & Timestamp */}
                <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-300">
                    {isUser ? 'You' : msgModel.name}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Bubble Container */}
                <div
                  className={`relative max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm shadow-lg'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-sm shadow-md'
                  }`}
                >
                  {/* Message Content */}
                  <div className="whitespace-pre-wrap font-sans break-words">
                    {msg.content}
                  </div>

                  {/* Specialist Handoff Recommendation Banner */}
                  {msg.routedTo && (
                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-cyan-300 font-medium">
                        Recommended: <strong className="text-white uppercase">{msg.routedTo}</strong>
                      </div>
                      <button
                        onClick={() => onSwitchModel(msg.routedTo!)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-[10px] font-bold text-cyan-300 transition-all"
                      >
                        <span>Switch Specialist</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Actions for assistant responses */}
                  {!isUser && (
                    <div className="flex items-center justify-end gap-1.5 mt-2 pt-2 border-t border-slate-800/60 text-slate-400">
                      <button
                        onClick={() => onSpeakMessage(msg.content, msgModel)}
                        className="p-1 hover:text-white rounded hover:bg-slate-800 transition-all"
                        title="Read aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(msg.id, msg.content)}
                        className="p-1 hover:text-white rounded hover:bg-slate-800 transition-all"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span>{activeModel.name} is synthesizing response...</span>
          </div>
        )}
      </div>

      {/* Composer Input Area */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/70">
        <div className="relative rounded-xl border border-slate-700/80 bg-slate-950/80 focus-within:border-cyan-500/60 transition-all">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${activeModel.name}... (Press Enter to send, Shift+Enter for newline)`}
            rows={2}
            className="w-full px-3.5 py-2.5 text-xs text-white placeholder-slate-500 bg-transparent resize-none focus:outline-none"
          />

          <div className="flex items-center justify-between px-3 pb-2 pt-1 border-t border-slate-900/60">
            <button
              onClick={onStartVoice}
              className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-medium text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-all"
              title="Voice input"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice</span>
            </button>

            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                inputText.trim() && !isLoading
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Send</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
