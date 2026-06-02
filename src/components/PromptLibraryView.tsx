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
  FileText,
  Bookmark
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
      setFormError('Please fill in all prompt template parameters.');
      return;
    }

    onAddCustomPrompt({
      title: newTitle,
      category: newCategory,
      description: newDescription,
      prompt: newPromptText,
    });

    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setNewPromptText('');
    setFormError('');
    setShowAddForm(false);
  };

  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
            <BookOpen className="h-3.5 w-3.5 shrink-0" />
            SaaS Asset Preloads
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">Prompt Library</h1>
          <p className="text-xs md:text-sm text-slate-400">
            Browse battle-tested high-converting prompt scripts or contribute your own custom recipes.
          </p>
        </div>

        <button
          id="btn-add-prompt"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-slate-100 text-xs font-bold leading-none cursor-pointer shadow-md shadow-indigo-600/15 transition-all"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span>{showAddForm ? 'View Prompt Cards' : 'Add Custom Template'}</span>
        </button>
      </div>

      {/* Creation Overlay container */}
      {showAddForm && (
        <form 
          onSubmit={handleCreatePrompt} 
          className="p-6 rounded-2xl bg-slate-900/50 border border-indigo-500/20 space-y-5 animate-fade-in"
        >
          <h3 className="text-sm font-bold text-slate-200">Compose Custom Prompt Recipe</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Template Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. PAS SaaS Landing Generator"
                className="w-full bg-slate-950 text-slate-200 border border-slate-900 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500/50 placeholder-slate-800 transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Platform Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="w-full bg-slate-950 text-slate-200 border border-slate-900 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500/50 cursor-pointer"
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
            <label className="text-xs font-semibold text-slate-400">Summary description (One-Sentence)</label>
            <input
              type="text"
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              placeholder="Briefly state target output values or purpose."
              className="w-full bg-slate-950 text-slate-200 border border-slate-900 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500/50 placeholder-slate-800 transition-colors"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Acode & Termux Compatible Prompt Instructions</label>
            <textarea
              value={newPromptText}
              onChange={e => setNewPromptText(e.target.value)}
              placeholder="e.g. Write a Problem-Agitate-Solve marketing framework explaining the importance of developer virtualization systems. Incorporate bulleted examples..."
              className="w-full h-24 bg-slate-950 text-slate-200 border border-slate-900 rounded-lg p-3 text-xs focus:outline-none focus:border-indigo-500/50 placeholder-slate-800 resize-none leading-relaxed transition-all"
              required
            />
          </div>

          {formError && (
            <div className="flex items-center gap-2 text-xs text-rose-400 p-2.5 bg-rose-500/5 border border-rose-500/10 rounded-lg">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-slate-100 text-xs font-bold leading-none cursor-pointer transition-colors"
            >
              Save Recipe
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setFormError('');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-400 text-xs font-bold leading-none cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Sorting & Search */}
      <div className="flex flex-col md:flex-row items-center gap-4 justify-between bg-slate-950/40 p-4 rounded-2xl border border-slate-900/60 shadow-sm shrink-0">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-650 shrink-0 select-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 text-slate-200 border border-slate-900 rounded-xl text-xs focus:outline-none focus:border-indigo-500/50 placeholder-slate-700 transition-colors"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar py-0.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-slate-100 font-extrabold'
                  : 'bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Card list */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPrompts.length === 0 ? (
          <div className="col-span-full p-12 rounded-xl bg-slate-950/20 text-center text-slate-500 space-y-2 border border-slate-950/40">
            <span className="text-xl inline-block mb-1">🔍</span>
            <p className="text-sm font-semibold">No template matched your query</p>
            <p className="text-xs text-slate-650">Try broadening your search term or selecting a different category.</p>
          </div>
        ) : (
          filteredPrompts.map((tpl) => {
            const isCustom = tpl.id.startsWith('custom-');
            return (
              <div 
                key={tpl.id}
                className="p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900/90 border border-slate-900 hover:border-slate-800 transition-all duration-300 flex flex-col justify-between group h-64"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-2 py-0.5 text-[9px] font-bold bg-indigo-500/10 text-indigo-400 rounded-md uppercase tracking-wider border border-indigo-500/20">
                      {tpl.category}
                    </span>
                    {isCustom && (
                      <button
                        onClick={() => onDeleteCustomPrompt(tpl.id)}
                        className="text-slate-600 hover:text-rose-400 p-1 rounded-md transition-colors cursor-pointer"
                        title="Delete custom recipe"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                      {tpl.title}
                    </h3>
                    <p className="text-xs text-slate-450 leading-relaxed line-clamp-3">
                      {tpl.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-950 flex items-center justify-between shrink-0 select-none">
                  <span className="text-[10px] text-slate-600 font-bold uppercase font-mono">
                    {isCustom ? 'User Contributed' : 'Platform Stock'}
                  </span>

                  <button
                    onClick={() => onDeployPrompt(tpl)}
                    className="text-xs text-indigo-400 group-hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <span>Load Editor</span>
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
