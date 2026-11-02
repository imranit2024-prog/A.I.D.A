import React, { useState } from 'react';
import {
  Calendar,
  Download,
  Edit2,
  MessageSquare,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { ConversationSession } from '../types';
import { AI_MODELS } from '../data/models';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ConversationSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onExportHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onRenameSession,
  onExportHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  if (!isOpen) return null;

  // Filter sessions by search query
  const filteredSessions = sessions.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.messages.some((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group chronologically
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  const groups: { [key: string]: ConversationSession[] } = {
    Today: [],
    Yesterday: [],
    'Previous 7 Days': [],
    Older: [],
  };

  filteredSessions.forEach((s) => {
    const diff = now - s.updatedAt;
    if (diff < oneDay) {
      groups.Today.push(s);
    } else if (diff < 2 * oneDay) {
      groups.Yesterday.push(s);
    } else if (diff < 7 * oneDay) {
      groups['Previous 7 Days'].push(s);
    } else {
      groups.Older.push(s);
    }
  });

  const handleStartRename = (s: ConversationSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(s.id);
    setEditTitle(s.title);
  };

  const handleSaveRename = (id: string) => {
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <aside className="fixed top-0 left-0 bottom-0 z-40 w-full sm:w-[380px] flex flex-col bg-slate-950/95 border-r border-slate-800/90 shadow-2xl backdrop-blur-xl transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Chat History
          </h3>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {sessions.length}
          </span>
        </div>

        <button
          onClick={onClose}
          aria-label="Close History Panel"
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-3 border-b border-slate-800/60">
        <button
          onClick={onNewSession}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Conversation</span>
        </button>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 bg-slate-900/80 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-500/60"
          />
        </div>
      </div>

      {/* Grouped Session List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            {searchQuery ? 'No conversations match your search.' : 'No saved conversations yet.'}
          </div>
        ) : (
          Object.entries(groups).map(([groupName, items]) => {
            if (items.length === 0) return null;

            return (
              <div key={groupName} className="space-y-1.5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                  {groupName}
                </h4>

                <div className="space-y-1">
                  {items.map((session) => {
                    const isActive = session.id === activeSessionId;
                    const model = AI_MODELS.find((m) => m.id === session.modelId) || AI_MODELS[0];

                    return (
                      <div
                        key={session.id}
                        onClick={() => onSelectSession(session.id)}
                        className={`group flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          isActive
                            ? 'bg-slate-900 border-cyan-500/60 shadow-md text-white'
                            : 'bg-slate-900/40 hover:bg-slate-900/80 border-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: model.accentColor }}
                          />

                          {editingId === session.id ? (
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onBlur={() => handleSaveRename(session.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(session.id);
                                if (e.key === 'Escape') setEditingId(null);
                              }}
                              autoFocus
                              className="px-1.5 py-0.5 text-xs bg-slate-800 text-white border border-cyan-500 rounded focus:outline-none"
                            />
                          ) : (
                            <div className="truncate">
                              <p className="font-semibold truncate">{session.title}</p>
                              <p className="text-[10px] text-slate-500 truncate">
                                {model.name} • {session.messages.length} messages
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Hover Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleStartRename(session, e)}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                            title="Rename"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSession(session.id);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer: Export */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
        <button
          onClick={onExportHistory}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-all"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export All History (JSON)</span>
        </button>
      </div>
    </aside>
  );
};
