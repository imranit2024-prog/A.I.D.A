import React, { useState } from 'react';
import {
  Check,
  Eye,
  Globe,
  Mic,
  Palette,
  Shield,
  Sliders,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import { UserSettings } from '../types';
import { AI_MODELS } from '../data/models';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onClearAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearAllData,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'avatar' | 'voice' | 'appearance' | 'privacy'>('general');
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              A.I.D.A Preferences & Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Settings"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-slate-800 bg-slate-900/30 px-6 gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'general', label: 'General', icon: Globe },
            { id: 'avatar', label: '3D Avatar', icon: Eye },
            { id: 'voice', label: 'Voice & Audio', icon: Volume2 },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'privacy', label: 'Privacy & Data', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
          {/* TAB: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <div>
                <label className="block text-slate-200 font-semibold mb-1">
                  Default Launch AI Model
                </label>
                <p className="text-[11px] text-slate-400 mb-2">
                  Select which specialist initializes when launching A.I.D.A (NON-STOP recommended).
                </p>
                <select
                  value={settings.defaultModelId}
                  onChange={(e) => onUpdateSettings({ defaultModelId: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                >
                  {AI_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} – {m.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-200 font-semibold mb-1">
                  Application Language
                </label>
                <select
                  value={settings.appLanguage}
                  onChange={(e) => onUpdateSettings({ appLanguage: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="en-US">English (United States)</option>
                  <option value="en-GB">English (United Kingdom)</option>
                  <option value="es-ES">Español (Spanish)</option>
                  <option value="fr-FR">Français (French)</option>
                  <option value="de-DE">Deutsch (German)</option>
                  <option value="ja-JP">日本語 (Japanese)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <p className="font-semibold text-slate-200">System Sound Effects</p>
                  <p className="text-[11px] text-slate-400">Play acoustic confirmation on model switches</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEffects}
                  onChange={(e) => onUpdateSettings({ soundEffects: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500"
                />
              </div>
            </div>
          )}

          {/* TAB: 3D AVATAR */}
          {activeTab === 'avatar' && (
            <div className="space-y-5">
              <div>
                <label className="block text-slate-200 font-semibold mb-1">
                  3D Graphics & Rendering Quality
                </label>
                <p className="text-[11px] text-slate-400 mb-2">
                  Adjusts antialiasing, shadow maps, and particle densities.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(['high', 'medium', 'performance'] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => onUpdateSettings({ avatarQuality: q })}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold capitalize transition-all ${
                        settings.avatarQuality === q
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <p className="font-semibold text-slate-200">Idle Animation (Breathing & Blinks)</p>
                  <p className="text-[11px] text-slate-400">Organic chest elevation and eye saccades</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableIdleAnimation}
                  onChange={(e) => onUpdateSettings({ enableIdleAnimation: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <p className="font-semibold text-slate-200">Wireframe Debug Mode</p>
                  <p className="text-[11px] text-slate-400">Inspect avatar geometry vertices and polygons</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.wireframeMode}
                  onChange={(e) => onUpdateSettings({ wireframeMode: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500"
                />
              </div>
            </div>
          )}

          {/* TAB: VOICE */}
          {activeTab === 'voice' && (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-200 font-semibold">Speech Rate</label>
                  <span className="text-cyan-400 font-mono">{settings.speechRate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={settings.speechRate}
                  onChange={(e) => onUpdateSettings({ speechRate: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-200 font-semibold">Vocal Pitch Offset</label>
                  <span className="text-cyan-400 font-mono">{settings.speechPitch.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.3"
                  step="0.05"
                  value={settings.speechPitch}
                  onChange={(e) => onUpdateSettings({ speechPitch: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <p className="font-semibold text-slate-200">Auto-Play Audio Responses</p>
                  <p className="text-[11px] text-slate-400">Read assistant replies aloud automatically</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoPlayAudio}
                  onChange={(e) => onUpdateSettings({ autoPlayAudio: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500"
                />
              </div>
            </div>
          )}

          {/* TAB: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-5">
              <div>
                <label className="block text-slate-200 font-semibold mb-2">
                  Global Accent Color Palette
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { color: '#00F2FE', name: 'Cyber Cyan' },
                    { color: '#8B5CF6', name: 'Amethyst' },
                    { color: '#10B981', name: 'Emerald' },
                    { color: '#F5D10D', name: 'Gold' },
                    { color: '#EF4444', name: 'Crimson' },
                    { color: '#3B82F6', name: 'Sapphire' },
                    { color: '#F59E0B', name: 'Amber' },
                    { color: '#EC4899', name: 'Neon Rose' },
                  ].map((theme) => (
                    <button
                      key={theme.color}
                      onClick={() => onUpdateSettings({ themeAccent: theme.color })}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        settings.themeAccent === theme.color
                          ? 'border-white bg-slate-900 shadow-md'
                          : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full shadow"
                        style={{ backgroundColor: theme.color }}
                      />
                      <span className="text-[10px] text-slate-300 font-medium">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Local Data Residency</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  A.I.D.A executes conversations with local browser persistence. Your microphone audio stream is processed ephemerally and is never recorded or stored to disk.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <label className="block text-rose-400 font-semibold mb-1">
                  Danger Zone
                </label>
                <p className="text-[11px] text-slate-400 mb-3">
                  Purge all conversation history, sessions, and reset settings to baseline.
                </p>

                {confirmClear ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onClearAllData();
                        setConfirmClear(false);
                      }}
                      className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all"
                    >
                      Confirm: Delete Everything
                    </button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmClear(true)}
                    className="px-3.5 py-2 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 font-semibold text-xs transition-all"
                  >
                    Clear All Chat History & Reset
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
