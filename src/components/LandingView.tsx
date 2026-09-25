import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  PenTool, 
  BookOpen, 
  History, 
  ArrowRight, 
  Check, 
  Copy, 
  FileText, 
  Download, 
  ChevronDown, 
  ShieldCheck, 
  Zap, 
  Compass,
  Terminal,
  ExternalLink,
  Sun,
  Moon
} from 'lucide-react';
import { UserProfile } from '../types';
import { AppHeader, AppFooter, Button, Badge } from './ui';

interface LandingViewProps {
  onEnterStudio: (tier?: 'free' | 'pro') => void;
  onOpenAuthModal: () => void;
  user: UserProfile;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

// Interactive sample scenarios for the Hero Transformation Sandbox
const SANDBOX_SCENARIOS = [
  {
    id: 'ai-agents',
    title: 'AI Developer Agents Release',
    category: 'Engineering & Product',
    input: 'Launching autonomous coding agents for developer environments. Features: sandbox execution, deterministic git rollback, real-time file diffs, zero hallucinations on API calls. Built for teams tired of manual refactors.',
    outputs: {
      blog: `### The Next Generation of Developer Tooling: Autonomous Agent Sandboxes

Software engineering is shifting from prompt-based autocomplete to autonomous execution loops. Today, we're introducing autonomous agent sandboxes built with deterministic state recovery and isolated execution runtimes.

#### Why Autocomplete Is No Longer Enough
Modern developer workflows require tools that understand full directory context rather than single-file edits. By combining isolated sandboxes with automated git rollback checkpoints, engineering teams can delegate complete migration tasks without risk of repository corruption.

**Key Architectural Highlights:**
- Deterministic sandbox execution with zero file bleed
- Instant git rollback snapshots on failed validations
- Real-time diff streaming with token-level precision`,
      linkedin: `Most AI coding tools write code. Few understand production environments.

Today, we're open-sourcing our autonomous coding agent sandbox.

The biggest issue with AI tooling isn't generation speed—it's safety and determinism. When an agent touches 15 files across a microservice architecture, one mistake shouldn't break your git log.

Here is what we engineered:
1. Sandboxed runtime execution isolated from host environments
2. Deterministic git snapshots that auto-rollback on test failure
3. Live diff streaming with zero hallucinated package dependencies

Engineering velocity increases when developers trust the output. What does your team look for in autonomous developer tools?`,
      xThread: [
        '1/5 Autonomous AI coding tools fail when they lack environment determinism. Today we are launching isolated agent sandboxes with instant rollback recovery. Here is how it works 🧵👇',
        '2/5 The core bottleneck in AI workflows isn’t model IQ—it is runtime safety. If an agent executes bad code across 10 files, the cleanup time erases any productivity gains.',
        '3/5 Our solution: A sandboxed runtime that snapshots your git tree before any edit. If unit tests fail, the environment resets instantly with zero manual cleanup required.',
        '4/5 In addition, diff streaming runs in real-time with sub-50ms latency, giving developers full visibility over file changes as they happen.',
        '5/5 Test the live developer sandbox today. Full documentation and benchmarks in bio.'
      ],
      instagram: `Coding without guardrails is a thing of the past. ⚡️

Introducing autonomous agent sandboxes for developers. Isolate code execution, verify builds automatically, and roll back instantly on failed tests.

Engineered for teams who ship fast and refuse to break staging. Link in bio to explore the architecture.

#SoftwareEngineering #DeveloperTools #TechArchitecture #Coding #SystemDesign`,
      newsletter: `Subject: Introducing Autonomous Agent Sandboxes for Engineering Teams

Hi {{First_Name}},

If you've tested autonomous coding tools recently, you've likely experienced the "cleanup paradox": the agent generates code in seconds, but you spend twenty minutes undoing accidental changes across your repository.

Today, we're unveiling our new Isolated Agent Sandbox.

Here is why this matters for your workflow:
- Deterministic execution: Code runs in a protected sandbox before committing to your workspace.
- Instant rollback: If any unit test fails, the state restores cleanly to your initial commit.
- Zero-drift dependencies: Only audited packages from your lockfile are permitted.

Read our full technical breakdown and launch benchmarks below.`
    }
  },
  {
    id: 'bootstrapped-mrr',
    title: 'Bootstrapping to $50k MRR',
    category: 'Founder & Growth',
    input: 'Bootstrapped SaaS reached $50k MRR in 14 months without venture capital. Strategy: focused solely on one painful user workflow (multi-channel content formatting), zero paid ads, public building updates, customer word of mouth.',
    outputs: {
      blog: `### Bootstrapping to $50k MRR: The Non-Obvious Lessons in Workflow Precision

Reaching $50k in monthly recurring revenue without outside funding taught us a fundamental rule: solve one repetitive, exhausting workflow with ruthless precision, and distribution will solve itself.

#### The Death of the "All-in-One" Myth
When we started 14 months ago, advice was to build an all-in-one suite. We did the opposite: we focused entirely on turning single ideas into 5 platform-calibrated formats.

**Three Core Operating Pillars:**
1. Zero paid ad spend—100% organic growth through public feature iterations
2. Direct customer feedback loops with weekly shipping cadences
3. Clear value metrics: saved hours per campaign rather than vanity traffic`,
      linkedin: `14 months ago, we made a contrarian bet:

No venture capital.
No paid advertising.
No complex feature bloat.

Today, our bootstrapped SaaS crossed $50,000 in monthly recurring revenue.

The #1 lesson we learned: Customers do not want another "all-in-one" platform that does 20 things poorly. They want a dedicated tool that eliminates one specific, repetitive headache in their workday.

For us, that was taking a single product thesis and translating it into 5 channel-ready assets without manual copy-pasting.

Focus on solving the single most tedious 30 minutes of your user’s morning, and word-of-mouth follows.`,
      xThread: [
        '1/4 We bootstrapped to $50k MRR in 14 months without funding or paid ads. Here are the 3 non-obvious rules that made it happen 🧵',
        '2/4 Rule 1: Kill the "all-in-one" ambition. Pick one agonizing workflow that users perform every single day and make it effortless.',
        '3/4 Rule 2: Share raw product iterations publicly. When users see bugs squashed and real feedback deployed weekly, they become your best salespeople.',
        '4/4 Rule 3: Price on time saved, not feature quantity. If your tool saves 4 hours every week, pricing at $29/mo is an effortless ROI calculation.'
      ],
      instagram: `14 months of heads-down focus. Zero venture funding. $50k MRR. 📈

When you stop trying to build everything for everyone and focus on solving one genuine pain point, momentum builds naturally.

Thank you to every founder and creator who trusted us from day one. Full story in bio.

#Bootstrapping #SaaS #BuildInPublic #Entrepreneurship #FounderJourney`,
      newsletter: `Subject: How We Reached $50,000 MRR in 14 Months Without Funding

Hey team,

Fourteen months ago, we launched our first beta to 12 beta testers. Today, our community crossed $50,000 in monthly recurring revenue.

We wanted to share the exact principles that drove this without spending a single dollar on paid acquisition:

1. Micro-workflow focus: We automated one painful routine—multi-channel content formatting.
2. Direct communication: Every early subscriber had direct access to our engineering roadmap.
3. Fast shipping cadence: We pushed updates twice weekly based on actual usage patterns.

Thank you for being part of this journey.`
    }
  },
  {
    id: 'async-loops',
    title: 'Non-Blocking Event Loops',
    category: 'Engineering Education',
    input: 'Deep dive into asynchronous non-blocking event loops in Node.js. Analogy: a high-efficiency espresso barista who queues orders, passes grind tasks to background timers, and never leaves the counter idle.',
    outputs: {
      blog: `### Demystifying the Asynchronous Event Loop: The Barista Paradigm

Understanding concurrency in single-threaded runtimes can feel counterintuitive until visualized through real-world mechanics.

#### The Single-Threaded Barista
Imagine a fast-service coffee bar operated by one barista. If the barista waited for the espresso machine to finish brewing before speaking to the next customer, the entire queue would stall.

Instead, the barista:
1. Registers the incoming customer request (event)
2. Delegates the hot water brewing to the machine (background worker)
3. Immediately accepts the next customer order while the espresso brews
4. Serves the completed beverage as soon as the machine signals completion (callback queue)`,
      linkedin: `How do you explain Node.js asynchronous event loops to someone who doesn't write backend code?

Use the Barista Analogy:

If a single barista waited for water to boil before taking the next customer's order, the coffee shop would go bankrupt in an hour.

That is synchronous, blocking execution.

Instead, the barista accepts order #1, pushes the button on the espresso machine, and immediately greets customer #2. When the espresso finishes, the chime dings, and the barista hands over the cup.

Single thread. Non-blocking I/O. Continuous throughput.

What is your favorite technical analogy?`,
      xThread: [
        '1/4 How does a single-threaded runtime handle 10,000 requests per second? Think like an espresso barista ☕️🧵',
        '2/4 In a blocking system, the barista takes your order, stares at the machine for 45 seconds while it brews, then takes the next order. Everything freezes.',
        '3/4 In an async non-blocking event loop, the barista queues the brew with the machine (I/O) and immediately takes the next person\'s order.',
        '4/4 When the machine dings (callback queue), the barista delivers the cup. Single thread, zero idle time. That is the Node.js event loop.'
      ],
      instagram: `Single-threaded doesn't mean slow. ⚡️

Swipe to see how the Node.js event loop operates just like a high-speed coffee barista handling hundreds of orders without stopping the queue.

Save this for your next systems design interview! 📌

#SystemDesign #WebDevelopment #Backend #ProgrammingTips #TechEducation`,
      newsletter: `Subject: Understanding Async Event Loops: The Coffee Barista Analogy

Hello engineering friends,

Concurrency in single-threaded architectures is one of the most frequently misunderstood topics in systems design.

To make it instantly intuitive, we put together a breakdown comparing event loops to an artisan espresso bar.

Key Takeaways:
- Call Stack: The barista taking your immediate order.
- Libuv Threadpool: The automated grinders and hot water tanks doing heavy lifting in parallel.
- Callback Queue: The bell dinging when your double shot is ready for pickup.

Read the full interactive guide on our tech blog.`
    }
  }
];

export default function LandingView({
  onEnterStudio,
  onOpenAuthModal,
  user,
  theme,
  onToggleTheme
}: LandingViewProps) {
  // Interactive sandbox state
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [activeChannelTab, setActiveChannelTab] = useState<'blog' | 'linkedin' | 'xThread' | 'instagram' | 'newsletter'>('blog');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Pricing duration toggle (Monthly vs Annual with 20% discount)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Interactive FAQ open state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const scenario = SANDBOX_SCENARIOS[selectedScenarioIndex] ?? SANDBOX_SCENARIOS[0]!;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const faqs = [
    {
      q: 'How does the 5-in-1 Content Stacker differ from standard ChatGPT prompts?',
      a: 'Generic chat assistants produce repetitive text that treats every platform like a generic paragraph. Sharp AI Max uses tailored platform prompt schemas and strict output validators. It formats blog posts with SEO markdown headers, LinkedIn narratives with whitespace readability, X threads with 280-character boundary compliance, Instagram captions with hashtag blocks, and newsletters with email subject lines—all generated in a single coordinated pipeline.'
    },
    {
      q: 'Where is my campaign data and prompt history saved?',
      a: '100% of your workspace data, prompt templates, and generation archives remain locally inside your browser\'s local storage. We do not maintain server-side user tracking databases or sell your editorial drafts.'
    },
    {
      q: 'Which AI model powers the Sharp AI Max content generation?',
      a: 'Sharp AI Max is powered by Google\'s state-of-the-art Gemini 3.8 Flash model, accessed through a secure, rate-limited server proxy that enforces payload bounds and concurrency slots for reliable sub-3s latency.'
    },
    {
      q: 'Can I export all five generated assets at once?',
      a: 'Yes. The Stacker includes an "Export Campaign (.md)" button that compiles your core thesis, generation date, custom tags, and all five channel deliverables into a single, clean Markdown document ready for Notion, Obsidian, or Google Docs.'
    },
    {
      q: 'Is there a free tier available without entering credit card details?',
      a: 'Yes. You can test Sharp AI Max with 100 free generation credits directly in your browser without entering any credit card or billing details. Pro preview grants 1,000 credits for larger team workflows.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-600 selection:text-white">
      {/* Unified Global Header Navigation */}
      <AppHeader
        variant="landing"
        user={user}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onEnterStudio={onEnterStudio}
        onOpenAuthModal={onOpenAuthModal}
      />

      <main>
        {/* HERO SECTION: Editorial Impact & Value Proposition */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Unboxed Metadata Kicker (Anti-Pill Compliant) */}
              <div className="flex items-center justify-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
                <span>Content Engineering SaaS</span>
                <span aria-hidden="true">·</span>
                <span>Powered by Gemini 3.8 Flash</span>
                <span aria-hidden="true">·</span>
                <span>100% Private Local Storage</span>
              </div>

              {/* Dominant Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Transform one core thesis into five channel-calibrated campaigns.
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
                Stop manually rewriting single posts for LinkedIn, blogs, newsletters, and X threads. Sharp AI Max formats, refines, and formats your idea into platform-native copy in seconds.
              </p>

              {/* Dual Primary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  id="hero-launch-btn"
                  onClick={() => onEnterStudio(user.tier || 'free')}
                  className="w-full sm:w-auto px-6 py-3.5 min-h-[48px] rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{user.isLoggedIn ? 'Return to Studio Workspace' : 'Launch Live Workspace'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <a
                  href="#sandbox"
                  className="w-full sm:w-auto px-6 py-3.5 min-h-[48px] rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>Test Interactive Demo</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </a>
              </div>

              {/* Authentic Trust Strip (Quiet unboxed text) */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-4 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>No credit card required</span>
                </div>
                <span aria-hidden="true" className="text-slate-700">·</span>
                <div className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>Sub-3s generation speed</span>
                </div>
                <span aria-hidden="true" className="text-slate-700">·</span>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-indigo-400" />
                  <span>Verified 280-char X threads</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE TRANSFORMATION SANDBOX (Hero Visual Proof) */}
        <section id="sandbox" className="py-20 bg-slate-900/40 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider">
                Live Interactive Experience
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                See how a single thesis branches into five formats
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Select an example prompt below to inspect the real multi-channel outputs synthesized by Sharp AI Max.
              </p>
            </div>

            {/* Scenario Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl">
              {SANDBOX_SCENARIOS.map((sc, idx) => (
                <button
                  type="button"
                  key={sc.id}
                  onClick={() => setSelectedScenarioIndex(idx)}
                  className={`flex-1 min-w-[160px] py-2 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer text-center ${
                    selectedScenarioIndex === idx
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="block truncate">{sc.title}</span>
                  <span className="block text-[10px] opacity-75 font-mono truncate">{sc.category}</span>
                </button>
              ))}
            </div>

            {/* Live Interactive Sandbox Box */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Source Input */}
              <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-indigo-400">
                    <Terminal className="h-4 w-4" />
                    <span>Raw Input Thesis</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{scenario.input.length} chars</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-mono min-h-[160px]">
                  "{scenario.input}"
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Automated Stacking Rule</span>
                  </div>
                  <p className="text-[11px] text-indigo-200/80 leading-relaxed">
                    The engine extracts the core hook, builds SEO outlines for longform, strips fluff for X threads, and frames high-intent CTAs for newsletters.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onEnterStudio(user.tier || 'free')}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{user.isLoggedIn ? 'Stack Your Idea in Studio' : 'Stack Your Own Idea in Studio'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Right Column: Multi-Channel Deliverable Preview */}
              <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
                {/* Channel Switcher Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'blog', label: 'SEO Blog Post' },
                      { id: 'linkedin', label: 'LinkedIn Narrative' },
                      { id: 'xThread', label: `X Thread (${scenario.outputs.xThread.length})` },
                      { id: 'instagram', label: 'Instagram Caption' },
                      { id: 'newsletter', label: 'Email Newsletter' },
                    ].map((tab) => (
                      <button
                        type="button"
                        key={tab.id}
                        onClick={() => setActiveChannelTab(tab.id as typeof activeChannelTab)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          activeChannelTab === tab.id
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const text = activeChannelTab === 'xThread' 
                        ? scenario.outputs.xThread.join('\n\n')
                        : scenario.outputs[activeChannelTab];
                      handleCopy(text, activeChannelTab);
                    }}
                    className="p-1.5 px-3 min-h-[36px] rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-800 transition-colors cursor-pointer"
                  >
                    {copiedKey === activeChannelTab ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Output</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Deliverable Body Display */}
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 min-h-[300px] text-xs sm:text-sm text-slate-200 leading-relaxed font-sans overflow-x-auto">
                  {activeChannelTab === 'xThread' ? (
                    <div className="space-y-3">
                      {scenario.outputs.xThread.map((tweet, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/90 space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                            <span className="font-bold text-indigo-400">Tweet {i + 1} of {scenario.outputs.xThread.length}</span>
                            <span>{tweet.length} / 280 chars</span>
                          </div>
                          <p className="whitespace-pre-wrap text-slate-200 text-xs leading-relaxed">{tweet}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed text-slate-200">
                      {scenario.outputs[activeChannelTab]}
                    </div>
                  )}
                </div>

                {/* Footer notes on this format */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                  <span>Channel Target: {activeChannelTab.toUpperCase()}</span>
                  <span>Validated by Sharp AI Max Editorial Parser</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE PILLARS SECTION: Editorial Feature Storytelling */}
        <section id="pillars" className="py-24 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider">
                Platform Architecture
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Three specialized systems. One unified workflow.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Rather than an all-in-one generic chatbot, Sharp AI Max delivers three purpose-built engines designed specifically for editorial leverage.
              </p>
            </div>

            {/* 3 Asymmetric Pillar Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Pillar 1 */}
              <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    01. Synchronous 5-in-1 Stacker
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Paste an outline or product thesis once. The stacking engine simultaneously drafts a longform SEO blog post, an executive LinkedIn narrative, a compliant 280-char X thread, a visual caption, and a subscriber email.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/80 text-xs font-mono text-indigo-300 flex items-center justify-between">
                  <span>Export: .md / Clipboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <PenTool className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    02. Single-Channel AI Writer
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    When you need deep, focused writing for a specific publication, switch to the dedicated single-channel editor. Calibrate register across Authoritative, Conversational, Technical, or Punchy tones with continuous auto-save.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/80 text-xs font-mono text-indigo-300 flex items-center justify-between">
                  <span>Export: .pdf / .md / Copy</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    03. Frameworks & Archive
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Deploy field-tested direct-response frameworks including PAS (Problem-Agitate-Solve), AIDA, and Eli5. Save your own custom prompt recipes and tag, search, or favorite drafts in your local studio archive.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/80 text-xs font-mono text-indigo-300 flex items-center justify-between">
                  <span>Storage: 100% Private Local</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORKFLOW SECTION: 3-Stage Production Pipeline */}
        <section id="workflow" className="py-24 bg-slate-900/30 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider">
                Production Velocity
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                From rough thesis to distributed campaign in three steps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <span className="text-2xl font-bold font-mono text-indigo-400">01</span>
                <h3 className="text-base font-bold text-white">Draft or Inject Framework</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your product thesis, release notes, or select a built-in copywriting framework like PAS or AIDA from the prompt library.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <span className="text-2xl font-bold font-mono text-indigo-400">02</span>
                <h3 className="text-base font-bold text-white">Synthesize 5 Channels</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Gemini 3.8 Flash orchestrates the translation, ensuring X tweets respect character limits and blog posts format with proper markdown hierarchy.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <span className="text-2xl font-bold font-mono text-indigo-400">03</span>
                <h3 className="text-base font-bold text-white">Tag, Export &amp; Distribute</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Download the entire campaign as structured Markdown, export individual PDFs, or copy directly to your social scheduling queue.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION: Transparent Quota Matrix */}
        <section id="pricing" className="py-24 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider">
                Transparent Workspace Access
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Simple, predictable local studio tiers
              </h2>
              <p className="text-sm text-slate-400">
                Choose the quota budget that matches your team's publishing frequency.
              </p>

              {/* Billing Toggle (Monthly / Annual) */}
              <div className="inline-flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    billingCycle === 'monthly' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    billingCycle === 'annual' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Annual (20% Off)
                </button>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
              {/* Free Tier */}
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Free Preview</h3>
                    <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase">Starter</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white tracking-tight">$0</span>
                    <span className="text-xs text-slate-400 font-mono">/ forever</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ideal for individual creators testing multi-channel content transformation workflows.
                  </p>

                  <ul className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>100 generation credits per session</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Full 5-in-1 Content Stacker engine</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Targeted Single-Channel AI Writer</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>6 stock marketing &amp; tech frameworks</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Export campaign suites to Markdown (.md)</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onEnterStudio('free')}
                  className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Start Free Workspace
                </button>
              </div>

              {/* Pro Tier */}
              <div className="p-8 rounded-2xl bg-slate-900 border-2 border-indigo-500/70 flex flex-col justify-between space-y-6 relative shadow-xl shadow-indigo-950/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Pro Creator</h3>
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">Recommended</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white tracking-tight">
                      {billingCycle === 'annual' ? '$19' : '$24'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">/ month</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Designed for founders, marketing teams, and power creators shipping weekly campaigns.
                  </p>

                  <ul className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                      <span className="font-semibold text-white">1,000 generation credits per month</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                      <span>Priority execution concurrency slots</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                      <span>Custom prompt recipe creation &amp; storage</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                      <span>Automated campaign archive with tags</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                      <span>PDF Document &amp; Markdown export support</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onEnterStudio('pro')}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Activate Pro Studio</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section id="faq" className="py-24 border-b border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider">
                Common Inquiries
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    >
                      <span className="text-sm font-semibold text-white">{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-indigo-400' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CLOSING CONVERSION BANNER */}
        <section className="py-20 bg-slate-900/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-indigo-950/30 border border-indigo-500/30 text-center space-y-6">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Ready to stop manually reformatting your content?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
                Open the live studio now and turn your next idea into a complete five-channel campaign in under 10 seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onEnterStudio(user.tier || 'free')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{user.isLoggedIn ? 'Return to Studio Workspace' : 'Launch Live Workspace Now'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Unified Global Footer */}
      <AppFooter
        variant="landing"
        onNavigateTab={() => onEnterStudio()}
      />
    </div>
  );
}
