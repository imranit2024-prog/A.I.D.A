import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileCode,
  FileText,
  Filter,
  Layers,
  Search,
  Sparkles,
  Table,
  X,
} from 'lucide-react';
import { FRD_SECTIONS, FUNCTIONAL_REQUIREMENTS_MATRIX } from '../data/frdSections';

interface FRDHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FRDHubModal: React.FC<FRDHubModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'document' | 'matrix' | 'architecture'>('document');
  const [selectedSectionNumber, setSelectedSectionNumber] = useState<number>(1);
  const [searchSection, setSearchSection] = useState('');
  const [matrixPriorityFilter, setMatrixPriorityFilter] = useState<'ALL' | 'P0' | 'P1' | 'P2'>('ALL');
  const [matrixSearch, setMatrixSearch] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentSection =
    FRD_SECTIONS.find((s) => s.number === selectedSectionNumber) || FRD_SECTIONS[0];

  const filteredSections = FRD_SECTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(searchSection.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchSection.toLowerCase())
  );

  const filteredMatrix = FUNCTIONAL_REQUIREMENTS_MATRIX.filter((r) => {
    const matchesPriority =
      matrixPriorityFilter === 'ALL' || r.priority === matrixPriorityFilter;
    const matchesSearch =
      r.id.toLowerCase().includes(matrixSearch.toLowerCase()) ||
      r.module.toLowerCase().includes(matrixSearch.toLowerCase()) ||
      r.feature.toLowerCase().includes(matrixSearch.toLowerCase()) ||
      r.behavior.toLowerCase().includes(matrixSearch.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const handleCopyFullFRD = () => {
    const fullText = FRD_SECTIONS.map((s) => s.contentMarkdown).join('\n\n---\n\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFRD = () => {
    const fullText = FRD_SECTIONS.map((s) => s.contentMarkdown).join('\n\n---\n\n');
    const blob = new Blob([fullText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AIDA_FUNCTIONAL_REQUIREMENTS_DOCUMENT.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-6xl h-[90vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  A.I.D.A – Complete Functional Requirements Document (FRD)
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase">
                  v1.0.0 Approved
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Production-grade architecture specification for Engineering, 3D Graphics, Voice & QA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyFullFRD}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy All MD</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadFRD}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close FRD Hub"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 border-b border-slate-800 bg-slate-900/40 gap-3">
          <button
            onClick={() => setActiveTab('document')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'document'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>35-Section FRD Document</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'matrix'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Requirements Matrix ({FUNCTIONAL_REQUIREMENTS_MATRIX.length} Items)</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'architecture'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>System Architecture Diagrams</span>
          </button>
        </div>

        {/* Tab 1: 35-Section FRD Document */}
        {activeTab === 'document' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Section Navigation Sidebar */}
            <div className="w-80 flex-shrink-0 border-r border-slate-800 bg-slate-900/50 flex flex-col">
              <div className="p-3 border-b border-slate-800">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchSection}
                    onChange={(e) => setSearchSection(e.target.value)}
                    placeholder="Search 35 sections..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredSections.map((sec) => {
                  const isSelected = sec.number === selectedSectionNumber;

                  return (
                    <button
                      key={sec.number}
                      onClick={() => setSelectedSectionNumber(sec.number)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-indigo-500/15 border-indigo-400/50 text-white shadow-sm'
                          : 'bg-slate-900/30 hover:bg-slate-900/80 border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 flex-shrink-0">
                        {String(sec.number).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold truncate text-slate-200">{sec.title}</p>
                        <p className="text-[10px] text-slate-500 line-clamp-1">
                          {sec.summary}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Section Content Viewer */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-950 text-slate-300 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <span className="font-mono text-sm px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  SECTION {String(currentSection.number).padStart(2, '0')}
                </span>
                <h3 className="text-xl font-extrabold text-white">
                  {currentSection.title}
                </h3>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 leading-relaxed italic">
                {currentSection.summary}
              </div>

              <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-3 font-sans">
                <div className="whitespace-pre-wrap font-sans">
                  {currentSection.contentMarkdown}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Requirements Matrix Table */}
        {activeTab === 'matrix' && (
          <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-4">
            {/* Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Priority Filter:</span>
                {(['ALL', 'P0', 'P1', 'P2'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setMatrixPriorityFilter(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                      matrixPriorityFilter === p
                        ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p === 'ALL' ? 'All Priorities' : p}
                  </button>
                ))}
              </div>

              <div className="relative w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={matrixSearch}
                  onChange={(e) => setMatrixSearch(e.target.value)}
                  placeholder="Filter by ID, module, feature..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Matrix Table */}
            <div className="flex-1 overflow-auto rounded-xl border border-slate-800 bg-slate-900/40">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase tracking-wider sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-bold">Req ID</th>
                    <th className="py-3 px-4 font-bold">Priority</th>
                    <th className="py-3 px-4 font-bold">Module</th>
                    <th className="py-3 px-4 font-bold">Feature Name</th>
                    <th className="py-3 px-4 font-bold">Trigger & Behavior</th>
                    <th className="py-3 px-4 font-bold">Acceptance Criteria</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredMatrix.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                        {req.id}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            req.priority === 'P0'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : req.priority === 'P1'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {req.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-200 whitespace-nowrap">
                        {req.module}
                      </td>
                      <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                        {req.feature}
                      </td>
                      <td className="py-3 px-4 max-w-xs text-slate-300">
                        <p className="text-[11px] text-slate-400">Trigger: {req.trigger}</p>
                        <p className="mt-0.5">{req.behavior}</p>
                      </td>
                      <td className="py-3 px-4 max-w-xs text-slate-400 text-[11px]">
                        {req.acceptanceCriteria}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: System Architecture Diagrams */}
        {activeTab === 'architecture' && (
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">
                1. Multi-Agent Orchestration & Routing Topology
              </h3>
              <p className="text-xs text-slate-400">
                NON-STOP evaluates incoming intent and delegates execution to domain specialists.
              </p>
              <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
{`                  ┌─────────────────────────────────────────┐
                  │          NON-STOP (Coordinator)         │
                  │   - Intent Classification               │
                  │   - General Query Resolution            │
                  │   - Intelligent Specialist Routing      │
                  └────────────────────┬────────────────────┘
                                       │
        ┌──────────────┬───────────────┼───────────────┬──────────────┐
        │              │               │               │              │
        ▼              ▼               ▼               ▼              ▼
  ┌───────────┐  ┌───────────┐  ┌─────────────┐  ┌───────────┐  ┌───────────┐
  │ EXECUTIVE │  │   CODER   │  │  ARCHITECT  │  │ SECURITY  │  │RESEARCHER │
  │ Business  │  │ Software  │  │ Infrastructure│ │ Cyber &   │  │ Analytics │
  │ Strategy  │  │  Engine   │  │  & Systems   │  │ Risk Guard│  │ & Evidence│
  └───────────┘  └───────────┘  └─────────────┘  └───────────┘  └───────────┘
                                       ▲
                                       │
                                 ┌─────┴─────┐
                                 │  WRITER   │
                                 │ Content & │
                                 │ Narrative │
                                 └───────────┘`}
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">
                2. Real-Time Audio & Viseme Lip-Sync Pipeline
              </h3>
              <p className="text-xs text-slate-400">
                Zero-latency frequency analysis driving the 3D jaw and mouth blend shapes.
              </p>
              <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
{`[User Microphone] ──► [AudioContext Analyser] ──► [Web Speech Recognition]
                                                           │
                                                           ▼ (Transcribed Text)
                                                   [Specialist AI Engine]
                                                           │
                                                           ▼ (AI Response Text)
[3D Avatar Jaw & Mouth] ◄── [FFT Frequency Bands] ◄── [SpeechSynthesis Utterance]`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
