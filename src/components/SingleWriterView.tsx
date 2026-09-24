import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Trash2, 
  Eye, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Facebook, 
  Mail, 
  FileText,
  AlertCircle,
  FolderPlus,
  Clock,
  RotateCcw
} from 'lucide-react';
import { ContentType, PromptCategory, PromptTemplate } from '../types';

interface SingleWriterViewProps {
  prompts: PromptTemplate[];
  onGenerate: (prompt: string, contentType: ContentType) => Promise<string>;
  onAddHistory: (input: string, output: string, contentType: ContentType, tags?: string[]) => void;
  prepopulatedPrompt?: string;
  prepopulatedType?: ContentType;
  onResetPrepopulated?: () => void;
}

export default function SingleWriterView({ 
  prompts, 
  onGenerate, 
  onAddHistory,
  prepopulatedPrompt,
  prepopulatedType,
  onResetPrepopulated
}: SingleWriterViewProps) {
  const [promptInput, setPromptInput] = useState('');
  const [contentType, setContentType] = useState<ContentType>('linkedin');
  const [selectedCategory, setSelectedCategory] = useState<'marketing' | 'business' | 'education' | 'technology' | 'personal branding' | 'all'>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [loadingText, setLoadingText] = useState('Analyzing input...');
  const [errorMsg, setErrorMsg] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Draft']);
  const [customTagText, setCustomTagText] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const statusTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Maximum character count budget for input brief
  const MAX_PROMPT_LENGTH = 4000;

  // Handle incoming prepopulated values
  useEffect(() => {
    if (prepopulatedPrompt) {
      setPromptInput(prepopulatedPrompt);
      if (prepopulatedType) {
        setContentType(prepopulatedType);
      }
      setAutoSaveStatus('Template loaded into editor');
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
      statusTimerRef.current = setTimeout(() => setAutoSaveStatus(''), 4000);
      onResetPrepopulated?.();
    }
  }, [prepopulatedPrompt, prepopulatedType, onResetPrepopulated]);

  // Load auto-saved draft from memory on initial mount
  useEffect(() => {
    const savedPrompt = localStorage.getItem('sharp_ai_single_prompt_autosave');
    const savedType = localStorage.getItem('sharp_ai_single_prompt_autosave_type');
    if (savedPrompt && !prepopulatedPrompt) {
      setPromptInput(savedPrompt);
      setAutoSaveStatus('Draft restored from local backup');
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
      statusTimerRef.current = setTimeout(() => setAutoSaveStatus(''), 5000);
    }
    if (savedType && !prepopulatedType) {
      setContentType(savedType as ContentType);
    }
  }, []);

  // Periodic 30-seconds auto-save worker
  useEffect(() => {
    const timerId = setInterval(() => {
      if (promptInput.trim()) {
        localStorage.setItem('sharp_ai_single_prompt_autosave', promptInput);
        localStorage.setItem('sharp_ai_single_prompt_autosave_type', contentType);
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setAutoSaveStatus(`Saved locally at ${timestamp}`);
        if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
        statusTimerRef.current = setTimeout(() => setAutoSaveStatus(''), 4000);
      }
    }, 30000);

    return () => {
      clearInterval(timerId);
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    };
  }, [promptInput, contentType]);

  // Target channels config
  const platforms: { id: ContentType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { id: 'x', label: 'X (Twitter)', icon: Twitter },
    { id: 'blog', label: 'SEO Blog', icon: FileText },
    { id: 'email', label: 'Newsletter', icon: Mail },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'facebook', label: 'Facebook', icon: Facebook },
  ];

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'business', label: 'Business' },
    { id: 'education', label: 'Education' },
    { id: 'technology', label: 'Technology' },
    { id: 'personal branding', label: 'Personal' },
  ];

  const loadingPhrases = [
    'Structuring hook and narrative flow...',
    'Optimizing format for chosen channel...',
    'Refining tone and voice...',
    'Finalizing call-to-action and formatting...'
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? prompts
    : prompts.filter(p => p.category === selectedCategory);

  const handleApplyTemplate = (tpl: PromptTemplate) => {
    setPromptInput(tpl.prompt);
    if (tpl.category === 'marketing') setContentType('facebook');
    else if (tpl.category === 'personal branding') setContentType('linkedin');
    else if (tpl.category === 'business') setContentType('email');
    else if (tpl.category === 'education') setContentType('blog');
  };

  const handleGenerate = async () => {
    if (!promptInput.trim()) {
      setErrorMsg('Please enter your idea, article topic, or draft outline.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg('');
    setGeneratedText('');
    setIsSaved(false);
    setIsCopied(false);

    let loadingIndex = 0;
    const interval = setInterval(() => {
      setLoadingText(loadingPhrases[loadingIndex % loadingPhrases.length] ?? 'Preparing content...');
      loadingIndex++;
    }, 2400);

    try {
      const output = await onGenerate(promptInput, contentType);
      setGeneratedText(output);
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : 'Generation failed.');
      setErrorMsg(error instanceof Error ? error.message : 'Content generation request failed. Check server connection and API key.');
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveToHistory = () => {
    if (!generatedText) return;
    onAddHistory(promptInput, generatedText, contentType, selectedTags);
    setIsSaved(true);
  };

  const wordCount = generatedText ? generatedText.trim().split(/\s+/).filter(Boolean).length : 0;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  const RenderSocialMockup = () => {
    if (!generatedText) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-500 space-y-3 min-h-[340px]">
          <Eye className="h-8 w-8 text-slate-700 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-slate-400">Live Preview &amp; Inspector</h4>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Select a channel on the left and generate copy to review formatted channel rendering in real time.
            </p>
          </div>
        </div>
      );
    }

    const cleanedText = generatedText.replace(/^[#\s]+.*$/m, '');

    switch (contentType) {
      case 'linkedin':
        return (
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4 max-w-md mx-auto text-sm animate-fade-in text-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center text-xs font-bold font-mono uppercase select-none">
                JD
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-white text-xs">
                  <span>Channel Preview</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1 py-0.2 rounded font-mono">1st</span>
                </div>
                <p className="text-[11px] text-slate-400">Preview profile • Just now</p>
              </div>
            </div>
            <div className="whitespace-pre-line text-slate-200 text-xs leading-relaxed">
              {cleanedText}
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 select-none">
              <span>LinkedIn-style preview</span>
              <span className="font-mono text-[10px]">LinkedIn Standard</span>
            </div>
          </div>
        );

      case 'x':
        return (
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3 max-w-md mx-auto text-sm animate-fade-in text-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-white font-mono">
                𝕏
              </div>
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-1">
                  <span>Channel Preview</span>
                  <span className="text-[10px] text-indigo-400 font-semibold font-mono">✓</span>
                </div>
                <p className="text-[11px] text-slate-500">channel-preview</p>
              </div>
            </div>
            <div className="whitespace-pre-line text-slate-200 text-xs leading-relaxed font-sans">
              {cleanedText}
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono select-none">
              <span>X-style thread preview</span>
              <span>{cleanedText.length} characters</span>
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="rounded-xl border border-slate-800 bg-slate-950 max-w-lg mx-auto overflow-hidden animate-fade-in text-slate-200">
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between select-none">
              <span className="text-xs text-slate-400 font-mono">article-preview.md</span>
              <span className="text-xs text-indigo-400 font-mono tabular-nums">{wordCount} words • {readingTimeMin} min read</span>
            </div>
            <div className="p-5 space-y-3 max-h-[380px] overflow-y-auto leading-relaxed text-xs text-slate-300">
              <div className="whitespace-pre-line">
                {generatedText}
              </div>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="rounded-xl border border-slate-800 bg-slate-950 max-w-md mx-auto overflow-hidden animate-fade-in text-slate-200">
            <div className="bg-slate-900 p-3.5 border-b border-slate-800 text-xs select-none space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-mono text-[11px]">Format:</span>
                <span className="text-slate-300 font-medium">Broadcast Email Newsletter</span>
              </div>
            </div>
            <div className="p-4 overflow-y-auto max-h-[360px] text-xs leading-relaxed space-y-3 text-slate-300 font-sans">
              <div className="whitespace-pre-line">
                {cleanedText}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-2.5 max-w-md mx-auto text-xs animate-fade-in text-slate-200">
            <div className="font-semibold text-xs text-indigo-400 uppercase tracking-wider font-mono">
              {contentType} Output
            </div>
            <div className="whitespace-pre-line text-slate-300 leading-relaxed max-h-[360px] overflow-y-auto">
              {cleanedText}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8 items-start animate-fade-in text-slate-100">
      {/* Inputs Column */}
      <div className="xl:col-span-7 space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white">Single Channel Writer</h2>
            <p className="text-xs text-slate-400">Generate targeted copy tailored for specific platform audiences and formats</p>
          </div>

          {/* Platform Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Target Channel</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {platforms.map(p => {
                const Icon = p.icon;
                const isSelected = contentType === p.id;
                return (
                  <button type="button"
                    key={p.id}
                    onClick={() => {
                      setContentType(p.id);
                      setGeneratedText('');
                      setErrorMsg('');
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-white font-semibold'
                        : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="h-4 w-4 mb-1.5 shrink-0" />
                    <span className="text-[11px] leading-tight">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt Templates */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Prompt Templates</label>
              <div className="flex gap-1 overflow-x-auto max-w-[280px] no-scrollbar">
                {categories.map(c => (
                  <button type="button"
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id as PromptCategory)}
                    className={`px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-md transition-colors cursor-pointer ${
                      selectedCategory === c.id 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-28 overflow-y-auto space-y-1.5 p-2 bg-slate-950 rounded-xl border border-slate-800">
              {filteredTemplates.length === 0 ? (
                <div className="text-center text-xs text-slate-500 py-6">No templates in this category.</div>
              ) : (
                filteredTemplates.map(tpl => (
                  <button type="button"
                    key={tpl.id}
                    onClick={() => handleApplyTemplate(tpl)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800/80 text-left transition-colors group cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors truncate">
                        {tpl.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">{tpl.description}</p>
                    </div>
                    <span className="text-[11px] font-mono text-indigo-400 shrink-0 font-semibold">Load &rarr;</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Main Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="prompt-input" className="text-slate-300 font-semibold flex items-center gap-2">
                <span>Prompt Brief &amp; Key Points</span>
                {autoSaveStatus && (
                  <span className="text-[11px] text-indigo-400 font-mono">
                    • {autoSaveStatus}
                  </span>
                )}
              </label>
              <span className="text-slate-500 font-mono text-[11px] tabular-nums">
                {promptInput.length}/{MAX_PROMPT_LENGTH}
              </span>
            </div>
            
            <textarea
              id="prompt-input"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value.slice(0, MAX_PROMPT_LENGTH))}
              placeholder="Describe your audience, topic, thesis, or product release. What are the key takeaways, arguments, or questions to address?"
              className="w-full h-36 bg-slate-950 text-slate-100 border border-slate-800 rounded-xl p-3.5 text-xs md:text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-600 resize-none leading-relaxed transition-colors"
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Trigger */}
          <button type="button"
            id="generate-single-button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold leading-none shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{loadingText}</span>
              </span>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-white" />
                <span>Generate {contentType.toUpperCase()} Campaign</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output and Preview Column */}
      <div className="xl:col-span-5 space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5 shadow-sm min-h-[460px] flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Eye className="h-3.5 w-3.5 text-slate-400" />
                <span>Workspace Output</span>
              </h3>
              {generatedText && (
                <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                  {wordCount} words • ~{readingTimeMin} min read
                </span>
              )}
            </div>

            {generatedText && (
              <div className="flex items-center gap-2">
                <button type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                  title="Copy to clipboard"
                  aria-label="Copy to clipboard"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button type="button"
                  id="save-draft-button"
                  onClick={handleSaveToHistory}
                  disabled={isSaved}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1 font-semibold transition-colors ${
                    isSaved
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white cursor-pointer'
                  }`}
                  title="Save to history storage"
                  aria-label="Save to history storage"
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                  <span>{isSaved ? 'Saved' : 'Save to Studio'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {generatedText && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Tags:</span>
                  {['Draft', 'Final', 'Q1-Campaign'].map(t => {
                    const isSelected = selectedTags.includes(t);
                    return (
                      <button type="button"
                        key={t}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedTags(prev => prev.filter(x => x !== t));
                          } else {
                            setSelectedTags(prev => [...prev, t]);
                          }
                        }}
                        className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded-md border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                  {selectedTags.filter(t => !['Draft', 'Final', 'Q1-Campaign'].includes(t)).map(t => (
                    <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-semibold rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {t}
                      <button type="button"
                        onClick={() => setSelectedTags(prev => prev.filter(x => x !== t))}
                        className="hover:text-rose-400 cursor-pointer text-xs leading-none"
                        aria-label={`Remove ${t} tag`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="+ Custom Tag"
                    value={customTagText}
                    onChange={(e) => setCustomTagText(e.target.value.slice(0, 20))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const trimmed = customTagText.trim();
                        if (trimmed && !selectedTags.includes(trimmed)) {
                          setSelectedTags(prev => [...prev, trimmed]);
                        }
                        setCustomTagText('');
                      }
                    }}
                    className="w-24 bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-[10px] focus:outline-none focus:border-indigo-500 text-slate-200 placeholder-slate-600 font-sans"
                  />
                </div>
              </div>
            )}
            <RenderSocialMockup />
          </div>
        </div>
      </div>
    </div>
  );
}
