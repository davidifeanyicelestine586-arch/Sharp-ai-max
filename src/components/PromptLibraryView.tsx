import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Trash2, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { PromptCategory, PromptTemplate } from '../types';
import { 
  PageHeader, 
  Card, 
  Button, 
  IconButton, 
  Badge, 
  FormField, 
  Input, 
  Textarea, 
  Select 
} from './ui';

interface PromptLibraryViewProps {
  prompts: PromptTemplate[];
  onAddCustomPrompt: (tpl: { title: string; category: PromptCategory; description: string; prompt: string }) => void;
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
    <div className="space-y-6 md:space-y-8 animate-fade-in text-slate-900 dark:text-slate-100">
      <PageHeader
        kicker="RECIPE DIRECTORY"
        title="Prompt Template Library"
        description="Battle-tested copywriting frameworks, sales email sequences, thought leadership blueprints, and custom recipes."
        actions={
          <Button
            id="btn-add-prompt"
            variant="primary"
            size="md"
            onClick={() => setShowAddForm(!showAddForm)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            {showAddForm ? 'Browse Directory' : 'New Template'}
          </Button>
        }
      />

      {/* Creation Modal / Form */}
      {showAddForm && (
        <Card variant="default" padding="lg">
          <form onSubmit={handleCreatePrompt} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create Custom Prompt Template</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField id="tpl-title" label="Template Title" required>
                <Input
                  id="tpl-title"
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Problem-Agitate-Solve Sales Email"
                  required
                />
              </FormField>

              <FormField id="tpl-category" label="Category">
                <Select
                  id="tpl-category"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as PromptCategory)}
                >
                  <option value="marketing">Marketing</option>
                  <option value="business">Business</option>
                  <option value="education">Education</option>
                  <option value="technology">Technology</option>
                  <option value="personal branding">Personal Branding</option>
                </Select>
              </FormField>
            </div>

            <FormField id="tpl-desc" label="Summary / Output Purpose" required>
              <Input
                id="tpl-desc"
                type="text"
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="Brief description of structure, tone, and intended outcome."
                required
              />
            </FormField>

            <FormField id="tpl-prompt" label="Prompt Instructions" required>
              <Textarea
                id="tpl-prompt"
                value={newPromptText}
                onChange={e => setNewPromptText(e.target.value)}
                placeholder="e.g. Write a persuasive Problem-Agitate-Solve newsletter outlining the risk of data leakage..."
                rows={4}
                required
              />
            </FormField>

            {formError && (
              <div role="alert" className="flex items-center gap-2 text-xs text-rose-500 p-2.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="primary" size="md">
                Save Template
              </Button>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                  setShowAddForm(false);
                  setFormError('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter and Search Bar */}
      <Card variant="subtle" padding="sm">
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="w-full sm:max-w-xs">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-0.5">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
        {filteredPrompts.length === 0 ? (
          <div className="col-span-full p-10 rounded-2xl bg-slate-50 dark:bg-slate-900/40 text-center text-slate-500 space-y-2 border border-slate-200 dark:border-slate-800">
            <BookOpen className="h-8 w-8 text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No template matches your search criteria</p>
            <p className="text-[11px] text-slate-400">Broaden your search terms or select another category filter.</p>
          </div>
        ) : (
          filteredPrompts.map((tpl) => {
            const isCustom = tpl.id.startsWith('custom-');
            return (
              <Card
                key={tpl.id}
                variant="subtle"
                padding="md"
                className="flex flex-col justify-between group min-h-[220px]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="primary" size="xs">
                      {tpl.category}
                    </Badge>
                    {isCustom && (
                      <IconButton
                        aria-label="Delete custom recipe"
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteCustomPrompt(tpl.id)}
                        className="text-slate-400 hover:text-rose-500 -mr-1"
                        title="Delete custom recipe"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </IconButton>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                      {tpl.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {tpl.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between shrink-0">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {isCustom ? 'User Recipe' : 'Curated'}
                  </span>

                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onDeployPrompt(tpl)}
                    rightIcon={<ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold"
                  >
                    Load to Editor
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
