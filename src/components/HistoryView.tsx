import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Eye, 
  Layers, 
  PenTool, 
  X,
  FileText,
  MoreVertical,
  Star,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { HistoryItem } from '../types';
import { exportItemToPDF } from '../utils/pdfGenerator';

interface HistoryViewProps {
  history: HistoryItem[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onCopy: (text: string) => void;
  copiedId: string | null;
  onUpdateTags?: (id: string, tags: string[]) => void;
  onOpenTagGuide?: () => void;
  onToggleFavorite: (id: string) => void;
  onRegenerate: (item: HistoryItem) => void;
}

export default function HistoryView({ 
  history, 
  onDelete, 
  onClearAll, 
  onCopy, 
  copiedId, 
  onUpdateTags, 
  onOpenTagGuide,
  onToggleFavorite,
  onRegenerate
}: HistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'single' | 'stacked' | 'favorites'>('all');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [showAddTagInput, setShowAddTagInput] = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const presets = ['Draft', 'Final', 'Q1-Campaign'];

  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed || !selectedItem) return;
    const currentTags = selectedItem.tags || [];
    if (!currentTags.includes(trimmed)) {
      const newTags = [...currentTags, trimmed];
      onUpdateTags?.(selectedItem.id, newTags);
      setSelectedItem(prev => prev ? { ...prev, tags: newTags } : null);
    }
    setCustomTagInput('');
    setShowAddTagInput(false);
  };

  // Get all unique tags
  const allUniqueTags = Array.from(new Set(
    history.reduce<string[]>((acc, item) => [...acc, ...(item.tags || [])], [])
  ));

  // Comprehensive deep search across title, input, and all generated outputs
  const filteredHistory = history.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    let matchesSearch = true;
    if (q) {
      const contentDump = [
        item.title,
        item.input,
        item.data.singleOutput || '',
        item.data.blogPost || '',
        item.data.linkedinPost || '',
        (item.data.xThread || []).join(' '),
        item.data.instagramCaption || '',
        item.data.emailNewsletter || '',
        item.data.facebookPost || '',
      ].join(' ').toLowerCase();

      matchesSearch = contentDump.includes(q);
    }

    const matchesType = filterType === 'all' || 
                        (filterType === 'favorites' ? item.isFavorite : item.type === filterType);
    const matchesTag = selectedTagFilter === 'all' || (item.tags || []).includes(selectedTagFilter);
    return matchesSearch && matchesType && matchesTag;
  });

  const handleDownload = (item: HistoryItem) => {
    let contentString = `# ${item.title}\n\n`;
    contentString += `> Created: ${new Date(item.createdAt).toLocaleString()}\n`;
    contentString += `> Source Concept: "${item.input}"\n\n`;
    contentString += `---\n\n`;

    if (item.type === 'single') {
      contentString += item.data.singleOutput || '';
    } else {
      contentString += `## 1. SEO Blog Post\n\n${item.data.blogPost || ''}\n\n`;
      contentString += `## 2. LinkedIn Post\n\n${item.data.linkedinPost || ''}\n\n`;
      contentString += `## 3. X (Twitter) Thread\n\n${(item.data.xThread || []).map((t, idx) => `### Tweet ${idx + 1}\n${t}`).join('\n\n')}\n\n`;
      contentString += `## 4. Instagram Caption\n\n${item.data.instagramCaption || ''}\n\n`;
      contentString += `## 5. Email Newsletter\n\n${item.data.emailNewsletter || ''}\n`;
    }

    const blob = new Blob([contentString], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFormatBadge = (item: HistoryItem) => {
    if (item.type === 'stacked') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
          <Layers className="h-2.5 w-2.5" /> Stacked
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase">
        <PenTool className="h-2.5 w-2.5" /> {item.contentType || 'Single'}
      </span>
    );
  };

  const getFullContentForCopy = (item: HistoryItem): string => {
    if (item.type === 'single') return item.data.singleOutput || '';
    return `[BLOG POST]\n${item.data.blogPost || ''}\n\n[LINKEDIN POST]\n${item.data.linkedinPost || ''}\n\n[X THREAD]\n${(item.data.xThread || []).join('\n\n')}\n\n[INSTAGRAM CAPTION]\n${item.data.instagramCaption || ''}\n\n[EMAIL NEWSLETTER]\n${item.data.emailNewsletter || ''}`;
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in text-slate-100">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
              Studio Archive
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Drafts &amp; Campaign History
            </h1>
            {onOpenTagGuide && (
              <button type="button"
                onClick={onOpenTagGuide}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-4 cursor-pointer font-medium"
              >
                Tag Guide &rarr;
              </button>
            )}
          </div>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl">
            Inspect, search, copy, and export any draft or multi-channel stack generated in this workspace.
          </p>
        </div>

        {history.length > 0 && (
          <div className="shrink-0">
            {showClearConfirm ? (
              <div className="flex items-center gap-2 p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                <span className="text-xs text-rose-300 font-medium">Delete all history items?</span>
                <button type="button"
                  onClick={() => {
                    onClearAll();
                    setShowClearConfirm(false);
                    setSelectedItem(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  Confirm Delete
                </button>
                <button type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button type="button"
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 text-xs font-semibold cursor-pointer transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear Archive</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 shrink-0 select-none pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts or generated text..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 text-slate-200 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition-colors"
            />
          </div>

          <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Drafts' },
              { id: 'single', label: 'Single Post' },
              { id: 'stacked', label: 'Stacked Suites' },
              { id: 'favorites', label: '★ Starred' },
            ].map(type => (
              <button type="button"
                key={type.id}
                onClick={() => setFilterType(type.id as PromptCategory)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  filterType === type.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Tag Filters */}
        {allUniqueTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 px-3.5 py-2 bg-slate-900/40 rounded-xl border border-slate-800/80 text-xs">
            <span className="font-mono text-[11px] text-slate-500 mr-1 uppercase">Filter by tag:</span>
            <button type="button"
              onClick={() => setSelectedTagFilter('all')}
              className={`px-2 py-0.5 text-[11px] font-mono font-medium rounded-md transition-colors cursor-pointer ${
                selectedTagFilter === 'all'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              All Tags
            </button>
            {allUniqueTags.map(tag => (
              <button type="button"
                key={tag}
                onClick={() => setSelectedTagFilter(tag)}
                className={`px-2 py-0.5 text-[11px] font-mono font-medium rounded-md transition-colors cursor-pointer ${
                  selectedTagFilter === tag
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Two-Column Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        {/* Left Column: Drafts List */}
        <div className="lg:col-span-5 space-y-3 max-h-[640px] overflow-y-auto pr-1">
          {filteredHistory.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
              <FolderOpen className="h-8 w-8 text-slate-600 mx-auto" />
              <h4 className="text-xs font-semibold text-slate-300">No matching drafts found</h4>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Generate content in Single Writer or Content Stacker to archive outputs here.
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-xl text-left border cursor-pointer transition-colors relative ${
                    isSelected
                      ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2 select-none">
                    <div className="flex items-center gap-1.5">
                      {getFormatBadge(item)}
                      {item.isFavorite && (
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 relative">
                      <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                        {new Date(item.createdAt).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </span>

                      {/* Quick Actions trigger button */}
                      <button type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === item.id ? null : item.id);
                        }}
                        className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Draft options"
                        aria-label="Draft options"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>

                      {/* Quick Actions Dropdown Menu */}
                      {openMenuId === item.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-30 cursor-default" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(null);
                            }}
                          />
                          <div className="absolute right-0 top-7 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-1 z-40 text-xs font-medium divide-y divide-slate-800">
                            <div className="py-1">
                              <button type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleFavorite(item.id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                              >
                                <Star className={`h-3.5 w-3.5 ${item.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
                                <span>{item.isFavorite ? 'Remove Star' : 'Add Star'}</span>
                              </button>
                              
                              <button type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRegenerate(item);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                              >
                                <RefreshCw className="h-3.5 w-3.5 text-indigo-400" />
                                <span>Re-generate Draft</span>
                              </button>

                              <button type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  exportItemToPDF(item);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                              >
                                <FileText className="h-3.5 w-3.5 text-indigo-400" />
                                <span>Export PDF</span>
                              </button>
                            </div>
                            
                            <div className="py-1">
                              <button type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(item.id);
                                  if (selectedItem?.id === item.id) setSelectedItem(null);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-400 hover:bg-rose-500/10 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete Permanently</span>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      "{item.input}"
                    </p>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2 text-[9px] font-mono font-medium">
                        {item.tags.map(t => (
                          <span key={t} className="px-1.5 py-0.5 rounded-md bg-slate-950 text-indigo-400 border border-slate-800">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Full Inspector View */}
        <div className="lg:col-span-7">
          {selectedItem ? (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5 shadow-sm min-h-[500px] flex flex-col h-[640px]">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4 shrink-0 gap-4">
                <div className="space-y-1.5 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{selectedItem.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 uppercase">
                      {selectedItem.type === 'single' ? `Single ${selectedItem.contentType} draft` : '5-in-1 stacked suite'}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                      {new Date(selectedItem.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Interactive Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {(selectedItem.tags || []).map(t => (
                      <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-semibold rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                        {t}
                        <button type="button"
                          onClick={() => {
                            const newTags = (selectedItem.tags || []).filter(x => x !== t);
                            onUpdateTags?.(selectedItem.id, newTags);
                            setSelectedItem(prev => prev ? { ...prev, tags: newTags } : null);
                          }}
                          className="hover:text-rose-400 cursor-pointer text-xs leading-none"
                          aria-label={`Remove ${t}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {showAddTagInput ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={customTagInput}
                          onChange={(e) => setCustomTagInput(e.target.value.slice(0, 20))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag(customTagInput);
                            }
                          }}
                          placeholder="Label name..."
                          className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-[10px] focus:outline-none focus:border-indigo-500 text-slate-200 w-24"
                          autoFocus
                        />
                        <button type="button"
                          onClick={() => handleAddTag(customTagInput)}
                          className="text-[10px] font-bold px-2 py-0.5 bg-indigo-600 rounded text-white cursor-pointer"
                        >
                          Add
                        </button>
                        <button type="button"
                          onClick={() => setShowAddTagInput(false)}
                          className="text-slate-500 hover:text-slate-300 cursor-pointer text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <button type="button"
                        onClick={() => setShowAddTagInput(true)}
                        className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-md bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                      >
                        + Add Tag
                      </button>
                    )}

                    {presets.filter(p => !(selectedItem.tags || []).includes(p)).map(p => (
                      <button type="button"
                        key={p}
                        onClick={() => {
                          const currentTags = selectedItem.tags || [];
                          const newTags = [...currentTags, p];
                          onUpdateTags?.(selectedItem.id, newTags);
                          setSelectedItem(prev => prev ? { ...prev, tags: newTags } : null);
                        }}
                        className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-slate-950 hover:bg-slate-850 text-slate-500 hover:text-slate-300 border border-slate-800 cursor-pointer"
                      >
                        +{p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button type="button"
                    onClick={() => onCopy(getFullContentForCopy(selectedItem))}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
                    title="Copy full draft content"
                    aria-label="Copy full draft content"
                  >
                    {copiedId === getFullContentForCopy(selectedItem) ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <button type="button"
                    onClick={() => handleDownload(selectedItem)}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
                    title="Download as Markdown (.md)"
                    aria-label="Download as Markdown"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button type="button"
                    onClick={() => exportItemToPDF(selectedItem)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5"
                    title="Export styled PDF"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>PDF</span>
                  </button>
                  <button type="button"
                    onClick={() => {
                      onDelete(selectedItem.id);
                      setSelectedItem(null);
                    }}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer text-xs"
                    title="Delete item"
                    aria-label="Delete item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-4 font-sans text-xs sm:text-sm">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase text-slate-500">
                    Source Concept / Input Prompt
                  </div>
                  <p className="text-slate-300 text-xs italic">
                    "{selectedItem.input}"
                  </p>
                </div>

                {selectedItem.type === 'single' ? (
                  <div className="whitespace-pre-wrap text-slate-200 leading-relaxed p-4 bg-slate-950 rounded-xl border border-slate-800">
                    {selectedItem.data.singleOutput}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[
                      { id: 'blog', name: 'SEO Blog Post', content: selectedItem.data.blogPost },
                      { id: 'linkedin', name: 'LinkedIn Post', content: selectedItem.data.linkedinPost },
                      { id: 'x', name: 'X Thread', content: (selectedItem.data.xThread || []).join('\n\n--- Next Tweet ---\n\n') },
                      { id: 'instagram', name: 'Instagram Caption', content: selectedItem.data.instagramCaption },
                      { id: 'email', name: 'Email Newsletter', content: selectedItem.data.emailNewsletter },
                    ].map(block => (
                      <div key={block.id} className="space-y-2 p-4 bg-slate-950 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                          <span className="text-[10px] font-mono font-bold uppercase text-indigo-400">{block.name}</span>
                          <button type="button"
                            onClick={() => onCopy(block.content || '')}
                            className="text-[11px] text-slate-400 hover:text-white cursor-pointer flex items-center gap-1 font-medium"
                          >
                            {copiedId === block.content ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <div className="whitespace-pre-wrap text-slate-300 text-xs leading-relaxed max-h-48 overflow-y-auto pr-1">
                          {block.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 flex flex-col items-center justify-center min-h-[500px] space-y-2">
              <Eye className="h-8 w-8 text-slate-600" />
              <h4 className="text-xs font-semibold text-slate-400">Select a draft to inspect</h4>
              <p className="text-[11px] text-slate-500 max-w-xs">
                Click any saved campaign on the left to inspect, download as Markdown, copy, or export as PDF.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
