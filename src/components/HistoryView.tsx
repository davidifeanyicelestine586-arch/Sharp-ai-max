/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  Linkedin,
  Twitter,
  Mail,
  MoreVertical,
  ChevronRight,
  AlertCircle,
  Star,
  RefreshCw
} from 'lucide-react';
import { HistoryItem, ContentType } from '../types';
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

  // Get all unique tags from active history items to populate tag filter choices
  const allUniqueTags = Array.from(new Set(
    history.reduce<string[]>((acc, item) => [...acc, ...(item.tags || [])], [])
  ));

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.input.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || 
                        (filterType === 'favorites' ? item.isFavorite : item.type === filterType);
    const matchesTag = selectedTagFilter === 'all' || (item.tags || []).includes(selectedTagFilter);
    return matchesSearch && matchesType && matchesTag;
  });

  const handleDownload = (item: HistoryItem) => {
    let contentString = `Title: ${item.title}\n`;
    contentString += `Date: ${new Date(item.createdAt).toLocaleString()}\n`;
    contentString += `Original Input Concept: "${item.input}"\n`;
    contentString += `--------------------------------------------------\n\n`;

    if (item.type === 'single') {
      contentString += item.data.singleOutput || '';
    } else {
      contentString += `=== 1. BLOG POST ===\n${item.data.blogPost || ''}\n\n`;
      contentString += `=== 2. LINKEDIN POST ===\n${item.data.linkedinPost || ''}\n\n`;
      contentString += `=== 3. X THREAD ===\n${(item.data.xThread || []).join('\n\n')}\n\n`;
      contentString += `=== 4. INSTAGRAM CAPTION ===\n${item.data.instagramCaption || ''}\n\n`;
      contentString += `=== 5. EMAIL NEWSLETTER ===\n${item.data.emailNewsletter || ''}\n`;
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
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Layers className="h-2.5 w-2.5" /> Stacked
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
        <PenTool className="h-2.5 w-2.5" /> {item.contentType}
      </span>
    );
  };

  const getFullContentForCopy = (item: HistoryItem): string => {
    if (item.type === 'single') return item.data.singleOutput || '';
    return `[BLOG]\n${item.data.blogPost || ''}\n\n[LINKEDIN]\n${item.data.linkedinPost || ''}\n\n[X THREAD]\n${(item.data.xThread || []).join('\n\n')}\n\n[INSTAGRAM]\n${item.data.instagramCaption || ''}\n\n[EMAIL]\n${item.data.emailNewsletter || ''}`;
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
            <History className="h-3.5 w-3.5 shrink-0" />
            Workspace Storage
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">Content Studio Archive</h1>
            {onOpenTagGuide && (
              <button
                onClick={onOpenTagGuide}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/25 transition-colors cursor-pointer select-none active:scale-95"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                Onboarding Guide
              </button>
            )}
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Review, copy, export, or tidy up any marketing campaigns generated in this workspace.
          </p>
        </div>

        {history.length > 0 && (
          <div className="relative">
            {showClearConfirm ? (
              <div className="flex items-center gap-2 p-1.5 bg-rose-500/10 border border-rose-500/25 rounded-xl animate-fade-in">
                <span className="text-[10px] font-bold text-rose-400 px-2">Clear all drafts permanently?</span>
                <button
                  onClick={() => {
                    onClearAll();
                    setShowClearConfirm(false);
                  }}
                  className="px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-slate-100 text-[10px] font-extrabold cursor-pointer transition-colors"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2.5 py-1 rounded-md bg-slate-850 hover:bg-slate-800 text-slate-350 text-[10px] font-bold cursor-pointer transition-colors border border-slate-800"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-400 hover:text-rose-400 text-xs font-bold leading-none cursor-pointer filter hover:border-slate-850 transition-all"
              >
                <Trash2 className="h-4 w-4 shrink-0" />
                <span>Empty Workspace Storage</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sorting bar & search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between bg-slate-950/40 p-4 rounded-2xl border border-slate-900/60 shadow-sm shrink-0">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-650 shrink-0 select-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campaign text or concept..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 text-slate-200 border border-slate-900 rounded-xl text-xs focus:outline-none focus:border-indigo-500/50 placeholder-slate-700 transition-colors"
            />
          </div>

          <div className="flex gap-1.5 py-0.5">
            {[
              { id: 'all', label: 'All Drafts' },
              { id: 'single', label: 'Single Post' },
              { id: 'stacked', label: 'Repurposed Stacks' },
              { id: 'favorites', label: '★ Favorites' },
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setFilterType(type.id as any)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  filterType === type.id
                    ? 'bg-indigo-600 text-slate-100 font-extrabold'
                    : 'bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Tag Filters */}
        {allUniqueTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 bg-slate-950/20 rounded-2xl border border-slate-900/60 transition-all">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider font-mono mr-1.5 select-none">Filter by tag:</span>
            <button
              onClick={() => setSelectedTagFilter('all')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                selectedTagFilter === 'all'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-950'
              }`}
            >
              All Tags
            </button>
            {allUniqueTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTagFilter(tag)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                  selectedTagFilter === tag
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-950'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Studio archive area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column - items list */}
        <div className="lg:col-span-5 space-y-3.5 product-drafts-list max-h-[600px] overflow-y-auto pr-1">
          {filteredHistory.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-950/20 border border-slate-950/40 space-y-3">
              <span className="text-xl">🗂️</span>
              <h4 className="text-sm font-semibold text-slate-300">No campaigns stored</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Content draft outlines saved from the AI Write or Content Stacker systems will archive here.
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-xl text-left border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-500/10 border-indigo-500/50 shadow-md shadow-indigo-500/5'
                      : 'bg-slate-900/50 hover:bg-slate-900 border-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2 select-none">
                    <div className="flex items-center gap-1.5">
                      {getFormatBadge(item)}
                      {item.isFavorite && (
                        <span className="flex items-center" title="Favorited">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 relative">
                      <span className="text-[9px] font-mono text-slate-500 dark:text-slate-450">
                        {new Date(item.createdAt).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </span>
                      {/* Quick Actions floating dropdown button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === item.id ? null : item.id);
                        }}
                        className="p-1 rounded hover:bg-slate-250 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                        title="Quick Actions"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>

                      {openMenuId === item.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-30 cursor-default" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(null);
                            }}
                          />
                          <div className="absolute right-0 top-6 mt-1 w-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-40 text-xs text-left animate-fade-in divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                            <div className="py-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleFavorite(item.id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors uppercase font-mono text-[9px] font-extrabold"
                              >
                                <Star className={`h-3.5 w-3.5 ${item.isFavorite ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                                <span>{item.isFavorite ? 'Unfavorite' : 'Favorite'}</span>
                              </button>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRegenerate(item);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors uppercase font-mono text-[9px] font-extrabold"
                              >
                                <RefreshCw className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                                <span>Re-generate</span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  exportItemToPDF(item);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors uppercase font-mono text-[9px] font-extrabold"
                              >
                                <FileText className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
                                <span>Export PDF</span>
                              </button>
                            </div>
                            
                            <div className="py-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(item.id);
                                  if (selectedItem?.id === item.id) setSelectedItem(null);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 dark:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-955/20 transition-colors uppercase font-mono text-[9px] font-extrabold"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete Item</span>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-200 line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                      Input text: "{item.input}"
                    </p>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5 select-none text-[8px] font-bold font-mono">
                        {item.tags.map(t => (
                          <span key={t} className="px-1.5 py-0.5 uppercase rounded-md tracking-wider bg-slate-950/80 text-indigo-400 border border-slate-900 shadow-sm">
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

        {/* Right column - details view */}
        <div className="lg:col-span-7">
          {selectedItem ? (
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-900 space-y-6 shadow-sm min-h-[450px] flex flex-col animate-fade-in h-[600px]">
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-4 shrink-0">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-200 line-clamp-1">{selectedItem.title}</h3>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1 inline-block">
                    {selectedItem.type === 'single' ? `Single ${selectedItem.contentType} draft` : '5-in-1 stacked draft'}
                  </span>
                  
                  {/* Interactive Dynamic Draft Tags Board */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5 select-none">
                    {(selectedItem.tags || []).map(t => (
                      <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase font-mono rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm">
                        {t}
                        <button
                          onClick={() => {
                            const newTags = (selectedItem.tags || []).filter(x => x !== t);
                            onUpdateTags?.(selectedItem.id, newTags);
                            setSelectedItem(prev => prev ? { ...prev, tags: newTags } : null);
                          }}
                          className="hover:text-rose-400 cursor-pointer p-0.5 rounded transition-colors text-indigo-400"
                        >
                          <X className="h-2.5 w-2.5 shrink-0" />
                        </button>
                      </span>
                    ))}

                    {/* Expandable text typing block */}
                    {showAddTagInput ? (
                      <div className="flex items-center gap-1.5 animate-fade-in py-0.5">
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
                          placeholder="Type label name..."
                          className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:border-indigo-500/50 text-slate-300 font-sans w-24"
                          autoFocus
                        />
                        <button
                          onClick={() => handleAddTag(customTagInput)}
                          className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-600 hover:bg-indigo-500 rounded text-slate-100 cursor-pointer"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setShowAddTagInput(false)}
                          className="text-slate-500 hover:text-slate-300 cursor-pointer"
                        >
                          <X className="h-3 w-3 shrink-0" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAddTagInput(true)}
                        className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-extrabold rounded bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-400 hover:text-indigo-400 cursor-pointer transition-colors"
                      >
                        + Custom Label
                      </button>
                    )}

                    {/* Presets suggestions directly available in gray text buttons */}
                    {presets.filter(p => !(selectedItem.tags || []).includes(p)).map(p => (
                      <button
                        key={p}
                        onClick={() => {
                          const currentTags = selectedItem.tags || [];
                          const newTags = [...currentTags, p];
                          onUpdateTags?.(selectedItem.id, newTags);
                          setSelectedItem(prev => prev ? { ...prev, tags: newTags } : null);
                        }}
                        className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-950 hover:bg-slate-900 text-slate-500 hover:text-slate-300 border border-slate-900 cursor-pointer transition-colors"
                      >
                        +{p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onCopy(getFullContentForCopy(selectedItem))}
                    className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                    title="Copy full campaign"
                  >
                    {copiedId === getFullContentForCopy(selectedItem) ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400 pointer-events-none" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDownload(selectedItem)}
                    className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                    title="Download/Export Markdown"
                  >
                    <Download className="h-3.5 w-3.5 font-bold" />
                  </button>
                  <button
                    onClick={() => exportItemToPDF(selectedItem)}
                    className="p-1.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/30 border border-indigo-900/40 text-indigo-400 hover:text-indigo-300 transition-all cursor-pointer text-xs flex items-center gap-1.5 font-bold px-2.5 active:scale-95"
                    title="Export as Styled PDF"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Export PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      onDelete(selectedItem.id);
                      setSelectedItem(null);
                    }}
                    className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                    title="Delete permanently"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Detail display container */}
              <div className="flex-1 overflow-y-auto pr-1 select-text space-y-4 font-sans no-scrollbar">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-900/80 mb-2">
                  <h5 className="text-[10px] font-extrabold uppercase text-slate-500 font-mono mb-1">ORIGINAL Spark INPUT</h5>
                  <p className="text-xs text-slate-450 italic">"{selectedItem.input}"</p>
                </div>

                {selectedItem.type === 'single' ? (
                  <div className="whitespace-pre-wrap text-slate-300 text-xs sm:text-sm leading-relaxed p-4 bg-slate-950 rounded-xl border border-slate-900">
                    {selectedItem.data.singleOutput}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Multi channel stack blocks */}
                    {[
                      { id: 'blog', name: 'SEO Blog Post', content: selectedItem.data.blogPost },
                      { id: 'linkedin', name: 'LinkedIn Native', content: selectedItem.data.linkedinPost },
                      { id: 'x', name: 'X tweet sequence', content: (selectedItem.data.xThread || []).join('\n\n--- Tweet Thread Break ---\n\n') },
                      { id: 'instagram', name: 'Instagram Caption', content: selectedItem.data.instagramCaption },
                      { id: 'email', name: 'Email Newsletter', content: selectedItem.data.emailNewsletter },
                    ].map(block => (
                      <div key={block.id} className="space-y-2 p-4 bg-slate-950 rounded-xl border border-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                          <span className="text-[10px] font-extrabold uppercase text-indigo-400 font-mono">{block.name}</span>
                          <button
                            onClick={() => onCopy(block.content || '')}
                            className="text-[10px] font-semibold text-slate-500 hover:text-slate-300 flex items-center gap-0.5 cursor-pointer"
                          >
                            {copiedId === block.content ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <div className="whitespace-pre-wrap text-slate-300 text-xs leading-relaxed max-h-40 overflow-y-auto font-sans pr-1">
                          {block.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-900/20 border border-slate-900/60 text-slate-500 flex flex-col items-center justify-center min-h-[450px] space-y-3 leading-relaxed">
              <Eye className="h-10 w-10 text-slate-700 shrink-0 select-none animate-pulse" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-400">Detailed Copy Inspector</h4>
                <p className="text-xs text-slate-650 max-w-xs">
                  Select any workspace draft on the left to inspect, download, copy, or export in standard Markdown format.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
