/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SPECIALIST_DESIGNS, SpecialistDesign } from './data/models';
import { AvatarState, ChatMessage, ConversationSession } from './types';
import { SpecialistStage } from './components/SpecialistStage';
import { FRDHubModal } from './components/FRDHubModal';
import { voiceService } from './services/voiceService';
import { aiService } from './services/aiService';

const STORAGE_KEY_SESSIONS = 'aida.st';
const STORAGE_KEY_CONFIG = 'aida.cfg';

interface AppConfig {
  lang: string;
  voice: boolean;
  rate: number;
  idle: number;
  glow: boolean;
  panels: boolean;
  theme: 'auto' | 'dark' | 'light';
}

const DEFAULT_CONFIG: AppConfig = {
  lang: 'bn-BD',
  voice: true,
  rate: 1.0,
  idle: 1.0,
  glow: true,
  panels: false,
  theme: 'auto',
};

export default function App() {
  // Current specialist index (0 = Non-stop, 1 = Executive, 2 = Coder, etc.)
  const [cur, setCur] = useState<number>(0);
  const currentSpecialist: SpecialistDesign = SPECIALIST_DESIGNS[cur] || SPECIALIST_DESIGNS[0];

  // Avatar & Voice state
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [audioVolume, setAudioVolume] = useState<number>(0);
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(32));
  const [liveTranscript, setLiveTranscript] = useState<string>('');

  // UI Panels
  const [isHistOpen, setIsHistOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isSetOpen, setIsSetOpen] = useState<boolean>(false);
  const [isFRDOpen, setIsFRDOpen] = useState<boolean>(false);
  const [isOverviewVisible, setIsOverviewVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);

  // App Configuration / Settings
  const [cfg, setCfg] = useState<AppConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch (e) {
      return DEFAULT_CONFIG;
    }
  });

  // Conversation Sessions
  const [sessions, setSessions] = useState<ConversationSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return [
      {
        id: 'session-' + Date.now(),
        title: 'New conversation',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        modelId: 'non-stop',
        messages: [],
      },
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions[0]?.id || 'default-session';
  });

  const currentSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Chat input
  const [inputText, setInputText] = useState<string>('');
  const [isLoadingReply, setIsLoadingReply] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const msgsScrollRef = useRef<HTMLDivElement>(null);
  const overviewTimeoutRef = useRef<any>(null);
  const toastTimeoutRef = useRef<any>(null);

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setIsToastVisible(false);
    }, 2400);
  };

  // Show Overview Card with timeout
  const showOverview = useCallback(() => {
    setIsOverviewVisible(true);
    if (overviewTimeoutRef.current) clearTimeout(overviewTimeoutRef.current);
    overviewTimeoutRef.current = setTimeout(() => {
      setIsOverviewVisible(false);
    }, 4200);
  }, []);

  // Sync theme, accent color, and CSS variables when specialist or theme changes
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', currentSpecialist.c);
    document.documentElement.style.setProperty(
      '--glow',
      `color-mix(in srgb, ${currentSpecialist.c} 50%, transparent)`
    );

    if (cfg.theme === 'light') {
      document.documentElement.dataset.theme = 'light';
    } else if (cfg.theme === 'dark') {
      document.documentElement.dataset.theme = 'dark';
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    voiceService.setLanguage(cfg.lang);
  }, [currentSpecialist, cfg.theme, cfg.lang]);

  // Persist config & sessions
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(cfg));
    } catch (e) {}
  }, [cfg]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch (e) {}
  }, [sessions]);

  // Scroll messages to bottom on new message
  useEffect(() => {
    if (msgsScrollRef.current) {
      msgsScrollRef.current.scrollTop = msgsScrollRef.current.scrollHeight;
    }
  }, [currentSession?.messages, isLoadingReply]);

  // Navigate to specialist
  const goTo = useCallback(
    (index: number, quiet: boolean = false) => {
      const nextIndex = (index + SPECIALIST_DESIGNS.length) % SPECIALIST_DESIGNS.length;
      setCur(nextIndex);

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setAvatarState('idle');

      if (!quiet) {
        showOverview();
      }
    },
    [showOverview]
  );

  // Close all panels
  const closeAllPanels = useCallback(() => {
    setIsHistOpen(false);
    setIsChatOpen(false);
    setIsSetOpen(false);
    setIsFRDOpen(false);
    setIsOverviewVisible(false);
  }, []);

  // Send message
  const handleSendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoadingReply) return;

      const userMsg: ChatMessage = {
        id: 'msg-u-' + Date.now(),
        sender: 'user',
        modelId: currentSpecialist.id as any,
        content: trimmed,
        timestamp: Date.now(),
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              title: s.messages.length === 0 ? trimmed.slice(0, 34) : s.title,
              updatedAt: Date.now(),
              messages: [...s.messages, userMsg],
            };
          }
          return s;
        })
      );

      setInputText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      setAvatarState('processing');
      setIsLoadingReply(true);

      try {
        const responseResult = await aiService.generateResponse(
          currentSpecialist.id as any,
          trimmed,
          currentSession?.messages || []
        );

        const aiMsg: ChatMessage = {
          id: 'msg-a-' + Date.now(),
          sender: 'assistant',
          modelId: currentSpecialist.id as any,
          content: responseResult.text,
          timestamp: Date.now(),
          routedTo: responseResult.recommendedSpecialist,
        };

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === activeSessionId) {
              return {
                ...s,
                updatedAt: Date.now(),
                messages: [...s.messages, aiMsg],
              };
            }
            return s;
          })
        );

        setIsLoadingReply(false);

        // Vocal reply if enabled
        if (cfg.voice) {
          setAvatarState('speaking');
          voiceService.speak(
            responseResult.text,
            {
              id: currentSpecialist.id as any,
              name: currentSpecialist.n,
              tagline: currentSpecialist.role,
              role: currentSpecialist.role,
              shortIntro: currentSpecialist.intro,
              specialization: currentSpecialist.skills.join(', '),
              description: currentSpecialist.intro,
              accentColor: currentSpecialist.c,
              accentGlow: `color-mix(in srgb, ${currentSpecialist.c} 50%, transparent)`,
              avatarStyle: {
                hairColor: 0x1d1a22,
                clothingColor: 0x1c2a44,
                accentColor: 0x22b8e8,
                visorOrGlass: false,
                garmentType: 'tactical',
              },
              voiceConfig: {
                pitch: 1.0,
                rate: cfg.rate,
                lang: cfg.lang,
                preferredVoiceNames: [],
              },
              capabilities: currentSpecialist.skills,
              suggestedPrompts: [],
              systemPrompt: '',
            },
            () => {
              setAvatarState('idle');
            }
          );
        } else {
          setAvatarState('idle');
        }
      } catch (err) {
        setIsLoadingReply(false);
        setAvatarState('idle');
      }
    },
    [currentSpecialist, activeSessionId, currentSession, isLoadingReply, cfg.voice, cfg.rate, cfg.lang]
  );

  // Setup voice callbacks
  useEffect(() => {
    voiceService.setCallbacks({
      onListeningStart: () => {
        setAvatarState('listening');
      },
      onListeningEnd: () => {
        if (avatarState === 'listening') {
          setAvatarState('idle');
        }
      },
      onSpeechResult: (transcript, isFinal) => {
        setLiveTranscript(transcript);
        if (isFinal && transcript.trim()) {
          voiceService.stopListening();
          setLiveTranscript('');
          handleSendMessage(transcript);
        }
      },
      onSpeakingStart: () => {
        setAvatarState('speaking');
      },
      onSpeakingEnd: () => {
        setAvatarState('idle');
      },
      onAudioFrequencyUpdate: (freqData, avgVolume) => {
        setFrequencyData(freqData);
        setAudioVolume(avgVolume);
      },
      onError: (errMsg) => {
        showToast(errMsg);
        setAvatarState('idle');
      },
    });
  }, [avatarState, handleSendMessage]);

  // Voice toggle (mic)
  const toggleVoice = () => {
    if (avatarState === 'listening') {
      voiceService.stopListening();
      setAvatarState('idle');
    } else {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setAvatarState('listening');
      voiceService.startListening();
    }
  };

  // Toggle voice replies
  const toggleVoiceReplies = () => {
    const nextVoice = !cfg.voice;
    setCfg((prev) => ({ ...prev, voice: nextVoice }));
    if (!nextVoice && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    showToast(nextVoice ? 'Voice replies enabled 🔊' : 'Voice replies muted 🔇');
  };

  // New conversation session
  const createNewSession = () => {
    const newSession: ConversationSession = {
      id: 'session-' + Date.now(),
      title: 'New conversation',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      modelId: currentSpecialist.id as any,
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    closeAllPanels();
    setIsChatOpen(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 250);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        goTo(cur - 1);
      } else if (e.key === 'ArrowRight') {
        goTo(cur + 1);
      } else if (e.key === 'Escape') {
        closeAllPanels();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cur, goTo, closeAllPanels]);

  // Day grouping helper for history
  const getDayGroup = (timestamp: number) => {
    const diff = (Date.now() - timestamp) / 864e5;
    return diff < 1 ? 'Today' : diff < 2 ? 'Yesterday' : 'Earlier';
  };

  // Render history items grouped by day
  const renderHistoryGroups = () => {
    let lastGroup = '';
    return sessions.map((s) => {
      const g = getDayGroup(s.updatedAt);
      const isNewGroup = g !== lastGroup;
      if (isNewGroup) lastGroup = g;

      const specIndex = SPECIALIST_DESIGNS.findIndex((p) => p.id === s.modelId);
      const specColor = specIndex >= 0 ? SPECIALIST_DESIGNS[specIndex].c : currentSpecialist.c;
      const isCurrent = s.id === activeSessionId;

      return (
        <React.Fragment key={s.id}>
          {isNewGroup && <div className="gl">{g}</div>}
          <button
            onClick={() => {
              setActiveSessionId(s.id);
              if (specIndex >= 0) goTo(specIndex, true);
              closeAllPanels();
              setIsChatOpen(true);
            }}
            className={`item ${isCurrent ? 'on' : ''}`}
          >
            <span
              className="dot"
              style={{ backgroundColor: specColor, color: specColor }}
            />
            <span className="t">{s.title || 'Conversation'}</span>
          </button>
        </React.Fragment>
      );
    });
  };

  // Copy assistant response
  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard');
  };

  const isAnyPanelOpen = isHistOpen || isChatOpen || isSetOpen || isFRDOpen;

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      {/* Background Radial Glow */}
      <div
        className="glow"
        style={{ opacity: cfg.glow ? 1 : 0 }}
      />

      {/* Top Header */}
      <header className="top">
        <div className="brand">
          <div className="logo" id="logo">✦</div>
          <span>AIDA</span>
        </div>

        <div className="tr">
          <button
            className="ibtn g"
            id="bHist"
            aria-label="History"
            aria-pressed={isHistOpen}
            onClick={() => {
              const next = !isHistOpen;
              closeAllPanels();
              setIsHistOpen(next);
            }}
          >
            ☰
          </button>

          <button
            className="ibtn g"
            id="bInfo"
            aria-label="About this specialist"
            onClick={showOverview}
          >
            i
          </button>

          <button
            className="ibtn g"
            id="bFRD"
            aria-label="FRD Specifications"
            title="Open 35-Section Functional Requirements Document"
            onClick={() => {
              closeAllPanels();
              setIsFRDOpen(true);
            }}
          >
            📄
          </button>

          <button
            className="ibtn g"
            id="bSet"
            aria-label="Settings"
            onClick={() => {
              const next = !isSetOpen;
              closeAllPanels();
              setIsSetOpen(next);
            }}
          >
            ⚙
          </button>
        </div>
      </header>

      {/* Specialist Title Section */}
      <div className="title">
        <h1 id="tN">{currentSpecialist.n}</h1>
        <p id="tR">{currentSpecialist.role}</p>
      </div>

      {/* Main Avatar Stage */}
      <SpecialistStage
        currentIndex={cur}
        onSelectIndex={(idx) => goTo(idx)}
        avatarState={avatarState}
        audioVolume={audioVolume}
        frequencyData={frequencyData}
        idleIntensity={cfg.idle}
        glowEnabled={cfg.glow}
      />

      {/* Carousel Navigation Arrows */}
      <button
        className="ibtn g nav l"
        id="prev"
        aria-label="Previous specialist"
        onClick={() => goTo(cur - 1)}
      >
        ‹
      </button>

      <button
        className="ibtn g nav r"
        id="next"
        aria-label="Next specialist"
        onClick={() => goTo(cur + 1)}
      >
        ›
      </button>

      {/* Specialist Dots / Selector Pills */}
      <div className="dots" id="dots">
        {SPECIALIST_DESIGNS.map((p, i) => (
          <button
            key={p.id}
            data-i={i}
            aria-current={i === cur}
            onClick={() => goTo(i)}
          >
            {p.n}
          </button>
        ))}
      </div>

      {/* Audio Status Indicator */}
      <div
        className="state"
        id="state"
        style={{
          display:
            avatarState === 'listening' ||
            avatarState === 'processing' ||
            avatarState === 'speaking'
              ? 'block'
              : 'none',
        }}
      >
        {avatarState === 'listening'
          ? 'Listening…'
          : avatarState === 'processing'
          ? 'Thinking…'
          : 'Speaking…'}
      </div>

      {/* Bottom Dock */}
      <div className="dock">
        <button
          className="ibtn g"
          id="bText"
          aria-label="Type a message"
          aria-pressed={isChatOpen}
          onClick={() => {
            const next = !isChatOpen;
            closeAllPanels();
            setIsChatOpen(next);
            if (next) {
              setTimeout(() => textareaRef.current?.focus(), 250);
            }
          }}
        >
          ⌨
        </button>

        <button
          className="mic"
          id="bMic"
          aria-pressed={avatarState === 'listening'}
          aria-label="Speak"
          onClick={toggleVoice}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
          </svg>
        </button>

        <button
          className="ibtn g"
          id="bVoice"
          aria-label="Toggle voice replies"
          aria-pressed={cfg.voice}
          onClick={toggleVoiceReplies}
        >
          {cfg.voice ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Floating Specialist Overview Card */}
      <div
        className={`ov g ${isOverviewVisible ? 'on' : ''}`}
        id="ov"
        onClick={() => setIsOverviewVisible(false)}
      >
        <h2>{currentSpecialist.n}</h2>
        <div className="r">{currentSpecialist.role}</div>
        <div>{currentSpecialist.intro}</div>
        <ul>
          {currentSpecialist.skills.map((skill, sIdx) => (
            <li key={sIdx}>{skill}</li>
          ))}
        </ul>
      </div>

      {/* Modal / Panel Backdrop Scrim */}
      <div
        className={`scrim ${isAnyPanelOpen ? 'on' : ''}`}
        id="scrim"
        onClick={closeAllPanels}
      />

      {/* Left Panel: History Drawer */}
      <aside className={`panel g l ${isHistOpen ? 'open' : ''}`} id="pHist">
        <div className="ph">
          <span>History</span>
          <button className="ibtn g" onClick={closeAllPanels} data-close>
            ✕
          </button>
        </div>

        <button className="newchat" id="newChat" onClick={createNewSession}>
          ＋ New conversation
        </button>

        <div className="list" id="list">
          {sessions.length === 0 ? (
            <div className="gl">No conversations yet</div>
          ) : (
            renderHistoryGroups()
          )}
        </div>
      </aside>

      {/* Right Panel: Conversation Drawer */}
      <aside className={`panel g r ${isChatOpen ? 'open' : ''}`} id="pChat">
        <div className="ph">
          <span id="cTitle">{currentSession.title || 'Conversation'}</span>
          <button className="ibtn g" onClick={closeAllPanels} data-close>
            ✕
          </button>
        </div>

        <div className="msgs" id="msgs" ref={msgsScrollRef} aria-live="polite">
          {currentSession.messages.length === 0 ? (
            <div className="empty">
              Say hello to {currentSpecialist.n}.<br />
              Tap the mic or type here.
            </div>
          ) : (
            currentSession.messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`m ${isUser ? 'u' : 'a'}`}
                  style={!isUser ? ({ '--c': currentSpecialist.c } as any) : undefined}
                >
                  {!isUser && (
                    <div className="who flex items-center justify-between">
                      <span>AIDA · {currentSpecialist.n}</span>
                      <button
                        onClick={() => copyMessage(m.content)}
                        className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800/60"
                        title="Copy message"
                      >
                        Copy
                      </button>
                    </div>
                  )}
                  {m.content}
                </div>
              );
            })
          )}

          {isLoadingReply && (
            <div className="m a" style={{ '--c': currentSpecialist.c } as any}>
              <div className="who">AIDA · {currentSpecialist.n}</div>
              <span className="italic opacity-70">Thinking…</span>
            </div>
          )}
        </div>

        <div className="composer">
          <div className="box">
            <textarea
              ref={textareaRef}
              id="inp"
              rows={1}
              value={inputText}
              placeholder={`Message ${currentSpecialist.n}…`}
              onChange={(e) => {
                setInputText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(110, e.target.scrollHeight) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }
              }}
            />
            <button
              className="send"
              id="send"
              disabled={!inputText.trim() || isLoadingReply}
              aria-label="Send"
              onClick={() => handleSendMessage(inputText)}
            >
              ↑
            </button>
          </div>
        </div>
      </aside>

      {/* Settings Modal */}
      <section
        className={`set g ${isSetOpen ? 'open' : ''}`}
        id="set"
        role="dialog"
        aria-label="Settings"
      >
        <h3>
          Settings
          <button
            className="ibtn g"
            onClick={closeAllPanels}
            style={{ width: '34px', height: '34px' }}
          >
            ✕
          </button>
        </h3>

        <div className="row">
          <div>
            Speech language
            <small>Voice input and replies</small>
          </div>
          <select
            id="sLang"
            value={cfg.lang}
            onChange={(e) => setCfg((prev) => ({ ...prev, lang: e.target.value }))}
          >
            <option value="bn-BD">বাংলা (Bengali)</option>
            <option value="en-US">English (US)</option>
          </select>
        </div>

        <div className="row">
          <div>Voice replies</div>
          <button
            className="sw"
            id="sVoice"
            role="switch"
            aria-checked={cfg.voice}
            aria-label="Voice replies"
            onClick={() => setCfg((prev) => ({ ...prev, voice: !prev.voice }))}
          />
        </div>

        <div className="row">
          <div>Speech speed</div>
          <input
            type="range"
            id="sRate"
            min="0.7"
            max="1.4"
            step="0.05"
            value={cfg.rate}
            onChange={(e) => setCfg((prev) => ({ ...prev, rate: parseFloat(e.target.value) }))}
          />
        </div>

        <div className="row">
          <div>
            Idle motion
            <small>How lively the avatar is</small>
          </div>
          <input
            type="range"
            id="sIdle"
            min="0"
            max="2"
            step="0.1"
            value={cfg.idle}
            onChange={(e) => setCfg((prev) => ({ ...prev, idle: parseFloat(e.target.value) }))}
          />
        </div>

        <div className="row">
          <div>Glow effects</div>
          <button
            className="sw"
            id="sGlow"
            role="switch"
            aria-checked={cfg.glow}
            aria-label="Glow"
            onClick={() => setCfg((prev) => ({ ...prev, glow: !prev.glow }))}
          />
        </div>

        <div className="row">
          <div>Theme</div>
          <select
            id="sTheme"
            value={cfg.theme}
            onChange={(e) => setCfg((prev) => ({ ...prev, theme: e.target.value as any }))}
          >
            <option value="auto">Auto</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        <div className="row pt-3">
          <div>
            Clear Chat Cache
            <small>Reset all saved conversations</small>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY_SESSIONS);
              setSessions([
                {
                  id: 'session-' + Date.now(),
                  title: 'New conversation',
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                  modelId: currentSpecialist.id as any,
                  messages: [],
                },
              ]);
              showToast('Chat history cleared');
            }}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30"
          >
            Reset
          </button>
        </div>
      </section>

      {/* Toast Notification */}
      <div className={`toast g ${isToastVisible ? 'on' : ''}`} id="toast">
        {toastMessage}
      </div>

      {/* Complete 35-Section FRD Specification Modal */}
      <FRDHubModal isOpen={isFRDOpen} onClose={() => setIsFRDOpen(false)} />
    </div>
  );
}
