/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  FolderPlus
} from 'lucide-react';
import { ContentType, PromptTemplate } from '../types';

interface SingleWriterViewProps {
  prompts: PromptTemplate[];
  onGenerate: (prompt: string, contentType: ContentType) => Promise<string>;
  onAddHistory: (input: string, output: string, contentType: ContentType) => void;
}

export default function SingleWriterView({ prompts, onGenerate, onAddHistory }: SingleWriterViewProps) {
  const [promptInput, setPromptInput] = useState('');
  const [contentType, setContentType] = useState<ContentType>('linkedin');
  const [selectedCategory, setSelectedCategory] = useState<'marketing' | 'business' | 'education' | 'technology' | 'personal branding' | 'all'>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [loadingText, setLoadingText] = useState('Drafting initial copy...');
  const [errorMsg, setErrorMsg] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Social platforms config
  const platforms = [
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { id: 'x', label: 'X (Twitter)', icon: Twitter, color: 'text-slate-200 bg-slate-800/20 border-slate-700' },
    { id: 'blog', label: 'SEO Blog', icon: FileText, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'email', label: 'Email Newsletter', icon: Mail, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-500 bg-blue-600/10 border-blue-600/20' },
  ];

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'business', label: 'Business' },
    { id: 'education', label: 'Education' },
    { id: 'technology', label: 'Technology' },
    { id: 'personal branding', label: 'Personal Branding' },
  ];

  const loadingPhrases = [
    'Styling persuasive formatting hooks...',
    'Injecting high-performance hashtags...',
    'Refining tone values...',
    'Curating layout structural grids...',
    'Injecting call-to-actions...',
    'Proofreading output with SaaS intelligence...'
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? prompts
    : prompts.filter(p => p.category === selectedCategory);

  const handleApplyTemplate = (tpl: PromptTemplate) => {
    setPromptInput(tpl.prompt);
    // Auto-select logical platform
    if (tpl.category === 'marketing') setContentType('facebook');
    else if (tpl.category === 'personal branding') setContentType('linkedin');
    else if (tpl.category === 'business') setContentType('email');
    else if (tpl.category === 'education') setContentType('blog');
  };

  const handleGenerate = async () => {
    if (!promptInput.trim()) {
      setErrorMsg('Please specify some thoughts, topics, or outlines to start writing.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg('');
    setGeneratedText('');
    setIsSaved(false);
    setIsCopied(false);

    // Rotate loading text
    let loadingIndex = 0;
    const interval = setInterval(() => {
      setLoadingText(loadingPhrases[loadingIndex % loadingPhrases.length]);
      loadingIndex++;
    }, 2800);

    try {
      const output = await onGenerate(promptInput, contentType);
      setGeneratedText(output);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Unable to communicate with the full-stack server. Check if the server is active.');
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
    onAddHistory(promptInput, generatedText, contentType);
    setIsSaved(true);
  };

  // Previews mockups
  const RenderSocialMockup = () => {
    if (!generatedText) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-500 space-y-3 min-h-[300px]">
          <Eye className="h-10 w-10 text-slate-700 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-400">Live Workspace Mockup</h4>
            <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
              Generate platform copy on the left to review exactly how your post appears across active social feeds.
            </p>
          </div>
        </div>
      );
    }

    const cleanedText = generatedText.replace(/^[#\s]+.*$/m, ''); // remove titles

    switch (contentType) {
      case 'linkedin':
        return (
          <div className="rounded-2xl border border-slate-900 bg-slate-950 p-5 space-y-4 max-w-md mx-auto text-sm animate-fade-in text-slate-200">
            {/* Header info */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white uppercase select-none">
                JD
              </div>
              <div>
                <div className="flex items-center gap-1 font-semibold text-slate-100 text-sm">
                  <span>Jane Doe</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded-md font-mono">PRO</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-none">Founder @ Sharp AI • 1h • Edited</p>
              </div>
            </div>
            {/* Main body text */}
            <div className="whitespace-pre-line text-slate-200 text-xs md:text-sm leading-relaxed">
              {cleanedText}
            </div>
            {/* Interactive metrics */}
            <div className="pt-2 border-t border-slate-900/60 flex items-center justify-between text-xs text-slate-500 font-medium select-none">
              <span>👍 158 likes</span>
              <span>💬 41 comments • 🧑‍💻 3 shares</span>
            </div>
          </div>
        );

      case 'x':
        return (
          <div className="rounded-2xl border border-slate-900 bg-slate-950 p-5 space-y-3 max-w-md mx-auto text-sm animate-fade-in text-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 pointer-events-none select-none">
                𝕏
              </div>
              <div>
                <div className="font-bold text-slate-100 flex items-center gap-1">
                  <span>Jane Doe</span>
                  <span className="text-[10px] text-indigo-400 font-bold shrink-0">✓ Verified</span>
                </div>
                <p className="text-[11px] text-slate-500">@janedoe_sharp • 10m ago</p>
              </div>
            </div>
            <div className="whitespace-pre-line text-slate-200 text-[13px] md:text-sm leading-relaxed font-sans">
              {cleanedText}
            </div>
            <div className="pt-2.5 border-t border-slate-900/60 flex items-center gap-6 text-xs text-slate-500 select-none">
              <span>💬 12</span>
              <span>🔁 43</span>
              <span>❤️ 295</span>
              <span>📊 12.5K views</span>
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="rounded-2xl border border-slate-900 bg-slate-950 max-w-lg mx-auto overflow-hidden animate-fade-in text-slate-200 shadow-xl">
            <div className="bg-slate-900/60 px-5 py-3.5 border-b border-slate-900 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs text-slate-500 font-mono tracking-tight font-semibold">my-content-studio.com/blog</span>
            </div>
            <div className="p-6 md:p-8 space-y-4 max-h-[400px] overflow-y-auto overflow-x-hidden text-slate-300">
              {/* Blog mockup formatting */}
              <div className="space-y-4">
                <div className="h-5 w-2/3 bg-slate-800 rounded-md animate-pulse mb-3" />
                <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-6">
                  <span>SaaS Strategy</span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
                <div className="whitespace-pre-line text-slate-300 text-xs md:text-sm leading-relaxed space-y-4">
                  {generatedText}
                </div>
              </div>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="rounded-2xl border border-slate-900 bg-slate-950 max-w-md mx-auto overflow-hidden animate-fade-in text-slate-200 shadow-xl">
            <div className="bg-slate-900/50 p-4 border-b border-slate-900 text-xs select-none">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-slate-550 font-semibold min-w-[50px] inline-block font-mono">From:</span>
                <span className="text-indigo-400 font-medium">David @ Sharp AI &lt;david@editor.sharp.ai&gt;</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-slate-550 font-semibold min-w-[50px] inline-block font-mono">Subject:</span>
                <span className="text-slate-200 font-bold truncate">Latest update inside your workspace</span>
              </div>
            </div>
            <div className="p-5 overflow-y-auto max-h-[350px] text-xs leading-relaxed space-y-4 text-slate-300 font-sans border-t border-slate-950">
              <div className="whitespace-pre-line">
                {cleanedText}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="rounded-2xl border border-slate-900 bg-slate-950 p-5 space-y-3 max-w-md mx-auto text-sm animate-fade-in text-slate-200">
            <div className="font-semibold text-xs text-indigo-400 uppercase tracking-widest font-mono">Preview Rendering</div>
            <div className="whitespace-pre-line text-slate-300 text-xs leading-relaxed">
              {cleanedText}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start animate-fade-in">
      {/* Inputs Column */}
      <div className="xl:col-span-7 space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-900 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-200">Single AI Creative Campaign</h2>
            <p className="text-xs text-slate-500">Fine-tune high-converting campaigns optimized for individual channels</p>
          </div>

          {/* Platform Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Target Channel</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {platforms.map(p => {
                const Icon = p.icon;
                const isSelected = contentType === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setContentType(p.id as ContentType);
                      setGeneratedText('');
                      setErrorMsg('');
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300 shadow-sm shadow-indigo-500/5 scale-102'
                        : 'bg-slate-950 hover:bg-slate-900 border-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="h-5 w-5 mb-1.5 shrink-0" />
                    <span className="text-[10px] font-bold tracking-tight">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt Template Library Picker */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400">Quick-Load Prompt Templates</label>
              <div className="flex gap-1 overflow-x-auto max-w-[250px] no-scrollbar">
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id as any)}
                    className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory === c.id 
                        ? 'bg-indigo-500 text-slate-100 font-extrabold' 
                        : 'bg-slate-950 hover:bg-slate-900 text-slate-500 border border-slate-900'
                    }`}
                  >
                    {c.label.replace(' templates', '')}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-28 overflow-y-auto space-y-1.5 pr-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-950/80">
              {filteredTemplates.length === 0 ? (
                <div className="text-center text-[11px] text-slate-600 py-6">No custom templates in this category.</div>
              ) : (
                filteredTemplates.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => handleApplyTemplate(tpl)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-900 text-left hover:border-slate-800 transition-colors group cursor-pointer"
                  >
                    <div>
                      <h4 className="text-[11px] font-semibold text-slate-300 group-hover:text-indigo-300 transition-colors">
                        {tpl.title}
                      </h4>
                      <p className="text-[9px] text-slate-500 line-clamp-1">{tpl.description}</p>
                    </div>
                    <span className="text-[9px] text-slate-600 font-semibold group-hover:text-indigo-400">Use →</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Main Area Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <label className="text-slate-400">What are you developing or marketing?</label>
              <span className="text-slate-600 font-mono text-[10px]">{promptInput.length}/1000 characters</span>
            </div>
            
            <textarea
              id="prompt-input"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value.slice(0, 1000))}
              placeholder="e.g. A developer terminal client that connects directly to local virtualization kernels or docker engines... describe the audience and core takeaway values here."
              className="w-full h-36 bg-slate-950 text-slate-200 border border-slate-900 rounded-xl p-4 text-xs md:text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 placeholder-slate-700 resize-none leading-relaxed transition-all"
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Trigger */}
          <button
            id="generate-single-button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-slate-100 text-xs font-bold leading-none shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{loadingText}</span>
              </span>
            ) : (
              <>
                <Sparkles className="h-4.5 w-4.5 text-slate-100 fill-indigo-400/20" />
                <span>Generate Campaign</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output and Preview Section */}
      <div className="xl:col-span-5 space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-900 space-y-6 shadow-sm min-h-[450px] flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-900/60 pb-4 shrink-0">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Eye className="h-4 w-4 text-slate-400" />
              <span>Live Workspace Copy</span>
            </h3>

            {generatedText && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                  title="Copy to clipboard"
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
                <button
                  id="save-draft-button"
                  onClick={handleSaveToHistory}
                  disabled={isSaved}
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 font-semibold cursor-pointer transition-colors ${
                    isSaved
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 cursor-default'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-900 text-indigo-400 hover:text-indigo-300'
                  }`}
                  title="Save to history drafts"
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                  <span>{isSaved ? 'Saved Draft' : 'Save to Studio'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            <RenderSocialMockup />
          </div>
        </div>
      </div>
    </div>
  );
}
