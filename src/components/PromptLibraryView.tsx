/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Trash2, 
  ArrowRight,
  AlertCircle,
  FileText
} from 'lucide-react';
import { PromptTemplate } from '../types';

interface PromptLibraryViewProps {
  prompts: PromptTemplate[];
  onAddCustomPrompt: (tpl: { title: string; category: any; description: string; prompt: string }) => void;
  onDeleteCustomPrompt: (id: string) => void;
  onDeployPrompt: (promptTpl: PromptTemplate) => void;
}

export default function PromptLibraryView({ 
  prompts, 
  onAddCustomPrompt, 
  onDeleteCustomPrompt, 
  onDeployPrompt 
}: PromptLibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'marketing' | 'business' | 'education' | 'technology' | 'personal branding'>('marketing');
  const [newDescription, setNewDescription] = useState('');
  const [newPromptText, setNewPromptText] = useState('');
  const [formError, setFormError] = useState('');

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'business', label: 'Business' },
    { id: 'education', label: 'Education' },
    { id: 'technology', label: 'Technology' },
    { id: 'personal branding', label: 'Personal Branding' },
  ];

  const handleCreatePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || !newPromptText.trim()) {
      setFormError('Please fill in title, description, and prompt instructions.');
      return;
    }

    onAddCustomPrompt({
      title: newTitle,
      category: newCategory,
      description: newDescription,
      prompt: newPromptText,
    });

    setNewTitle('');
    setNewDescription('');
    setNewPromptText('');
    setFormError('');
    setShowAddForm(false);
  };

  const filteredPrompts = prompts.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      p.title.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.prompt.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
              Recipe Directory
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Prompt Template Library
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl">
            Battle-tested copywriting frameworks, sales email sequences, thought leadership blueprints, and custom recipes.
          </p>
        </div>

        <button
          id="btn-add-prompt"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold leading-none cursor-pointer transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span>{showAddForm ? 'Browse Directory' : 'New Template'}</span>
        </button>
      </div>

      {/* Creation Modal / Form */}
      {showAddForm && (
        <form 
          onSubmit={handleCreatePrompt} 
          className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 animate-fade-in shadow-md"
        >
          <h3 className="text-sm font-bold text-white">Create Custom Prompt Template</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Template Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Problem-Agitate-Solve Sales Email"
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="marketing">Marketing</option>
                <option value="business">Business</option>
                <option value="education">Education</option>
                <option value="technology">Technology</option>
                <option value="personal branding">Personal Branding</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Summary / Output Purpose</label>
            <input
              type="text"
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              placeholder="Brief description of the structure, tone, and intended outcome."
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition-colors"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Prompt Instructions</label>
            <textarea
              value={newPromptText}
              onChange={e => setNewPromptText(e.target.value)}
              placeholder="e.g. Write a persuasive Problem-Agitate-Solve newsletter outlining the risk of data leakage. Include three clear takeaways and a demo sign-up link..."
              className="w-full h-24 bg-slate-950 text-slate-200 border border-slate-800 rounded-lg p-3 text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-600 resize-none leading-relaxed transition-colors"
              required
            />
          </div>

          {formError && (
            <div className="flex items-center gap-2 text-xs text-rose-400 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold leading-none cursor-pointer transition-colors"
            >
              Save Template
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setFormError('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 text-xs font-medium cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 shrink-0 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 text-slate-200 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition-colors"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-0.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
        {filteredPrompts.length === 0 ? (
          <div className="col-span-full p-10 rounded-xl bg-slate-900/40 text-center text-slate-500 space-y-2 border border-slate-800">
            <BookOpen className="h-8 w-8 text-slate-600 mx-auto" />
            <p className="text-xs font-semibold text-slate-400">No template matches your search criteria</p>
            <p className="text-[11px] text-slate-500">Broaden your search terms or select another category filter.</p>
          </div>
        ) : (
          filteredPrompts.map((tpl) => {
            const isCustom = tpl.id.startsWith('custom-');
            return (
              <div 
                key={tpl.id}
                className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 transition-colors flex flex-col justify-between group min-h-[220px]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 rounded-md uppercase tracking-wider border border-indigo-500/20">
                      {tpl.category}
                    </span>
                    {isCustom && (
                      <button
                        onClick={() => onDeleteCustomPrompt(tpl.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded-md transition-colors cursor-pointer"
                        title="Delete custom recipe"
                        aria-label="Delete custom recipe"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {tpl.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {tpl.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between shrink-0">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {isCustom ? 'User Recipe' : 'Curated'}
                  </span>

                  <button
                    onClick={() => onDeployPrompt(tpl)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Load to Editor</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
