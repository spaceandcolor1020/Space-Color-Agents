
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup, animate } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
  ShieldCheck, 
  Cpu, 
  Eye, 
  ArrowRight,
  Sparkles,
  Loader2,
  X,
  Archive,
  AlertCircle,
  FileText,
  Command
} from 'lucide-react';

import { LensId, ProjectData } from './types';
import { DEFAULT_PROJECT } from './constants';
import { generateLenses } from './services/geminiService';

// SOURCE OF TRUTH: Load assets directly from GitHub raw to bypass local server issues.
const CDN_BASE = "https://raw.githubusercontent.com/spaceandcolor1020/Space-Color-Agents/main/public/assets/";

// --- ANIMATION VARIANTS ---
const dossierTransition = { duration: 0.6, ease: [0.25, 1, 0.5, 1] };

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } 
  },
};

// --- CONFIG & METRICS: CONTEXTUAL CHANNEL LOGIC ---
const PARAM_CONFIG: Record<LensId | 'home', { label: string; value: number }[]> = {
  home: [
    { label: "SYSTEM_IDLE", value: 0 },
    { label: "LATENCY_THRESHOLD", value: 0 },
    { label: "TECHNICAL_DENSITY", value: 0 }
  ],
  recruiter: [
    { label: "STRATEGIC_SCOPE", value: 95 },
    { label: "MARKET_IMPACT", value: 100 },
    { label: "TECHNICAL_DENSITY", value: 15 }
  ],
  engineer: [
    { label: "SYSTEM_ARCHITECTURE", value: 98 },
    { label: "LOGIC_COMPLEXITY", value: 90 },
    { label: "TECHNICAL_DENSITY", value: 95 }
  ],
  designer: [
    { label: "USER_EMPATHY", value: 100 },
    { label: "VISUAL_CRAFT", value: 85 },
    { label: "TECHNICAL_DENSITY", value: 45 }
  ],
  source: [
    { label: "RAW_DATA_INTEGRITY", value: 100 },
    { label: "CONTEXTUAL_BIAS", value: 0 },
    { label: "FILTERING", value: 0 }
  ]
};

// --- AGENTIC PUBLISHING LOGIC ---
const LOGIC_STEPS = {
  recruiter: [
    "AUDIENCE_ANALYSIS: Talent & Leadership",
    "CURATING: Strategic_Highlights & ROI...",
    "CUTTING: Technical_Jargon...",
    "TYPESETTING: Executive_Brief_Layout",
    "STATUS: Ready for Print."
  ],
  engineer: [
    "AUDIENCE_ANALYSIS: Systems_Architecture",
    "SOURCING: Schematic_Diagrams & Logs...",
    "EXPANDING: Technical_Appendix...",
    "TYPESETTING: Documentation_Layout",
    "STATUS: Specs Verified."
  ],
  designer: [
    "AUDIENCE_ANALYSIS: Design_Systems",
    "SOURCING: Process_Artifacts & Journeys...",
    "WEAVING: Narrative_Thread...",
    "TYPESETTING: Visual_Essay_Layout",
    "STATUS: Rendering Assets."
  ],
  source: [
    "AUDIENCE_ANALYSIS: Archival_Audit",
    "RECOVERING: Unprocessed_Record...",
    "BYPASSING: Editorial_Filters...",
    "TYPESETTING: Raw_Transcripts",
    "STATUS: Archive_Unlocked."
  ]
};

// --- COMPONENTS ---

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 1,
      ease: [0.25, 1, 0.5, 1],
      onUpdate: (latest) => setDisplayValue(Math.floor(latest))
    });
    return () => controls.stop();
  }, [value]);

  return <span className="inline-block w-[4ch] text-right">[{displayValue}%]</span>;
};

interface MetricTrackProps {
  label: string;
  value: number;
  isUpdating: boolean;
  index: number;
  key?: React.Key;
}

const MetricTrack = ({ label, value, isUpdating, index }: MetricTrackProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-baseline h-4">
        <motion.span 
          layoutId={`metric-label-${index}`}
          animate={{ 
            color: isUpdating ? '#ffffff' : '#78716c',
            opacity: isUpdating ? 1 : 0.8
          }}
          className="mono-font text-[9px] uppercase tracking-[0.2em] font-black transition-colors"
        >
          {label}
        </motion.span>
        <span className="mono-font text-[9px] text-stone-500 font-bold tracking-widest">
          <AnimatedNumber value={value} />
        </span>
      </div>
      <div className="h-[1px] bg-stone-900 w-full relative">
        <motion.div 
          initial={{ left: '0%' }}
          animate={{ left: `${value}%` }}
          transition={{ type: "spring", stiffness: 45, damping: 10 }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1 h-3 bg-stone-200"
        />
      </div>
    </div>
  );
};

const GenerationParams = ({ activeLens }: { activeLens: LensId | 'home' }) => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const metrics = PARAM_CONFIG[activeLens];

  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => setIsUpdating(false), 800);
    return () => clearTimeout(timer);
  }, [activeLens]);

  return (
    <div className="space-y-8 mt-12">
      <LayoutGroup id="metrics-group">
        {metrics.map((metric, i) => (
          <MetricTrack 
            key={`${activeLens}-${i}`}
            index={i}
            label={metric.label} 
            value={metric.value} 
            isUpdating={isUpdating} 
          />
        ))}
      </LayoutGroup>
    </div>
  );
};

interface CuratingOverlayProps {
  lens: LensId;
  onComplete: () => void;
}

const CuratingOverlay = ({ lens, onComplete }: CuratingOverlayProps) => {
  const steps = LOGIC_STEPS[lens];
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    if (visibleSteps < steps.length) {
      const timer = setTimeout(() => setVisibleSteps(prev => prev + 1), 350);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [visibleSteps, steps.length, onComplete]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-stone-950/60 backdrop-blur-xl">
      <div className="max-w-md w-full text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-t-2 border-white rounded-full mx-auto mb-12 opacity-40" />
        <div className="mono-font text-[10px] text-stone-500 uppercase tracking-[0.5em] mb-8">System_Curating // {lens.toUpperCase()}_EDIT</div>
        <div className="space-y-4">
          {steps.slice(0, visibleSteps).map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 5 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mono-font text-white text-[11px] uppercase tracking-widest flex items-center justify-center gap-3"
            >
              <span className="text-stone-700">[{String(i+1).padStart(2, '0')}]</span>
              {step}
              {i === visibleSteps - 1 && <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>█</motion.span>}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// The robust CDN Image Loader styled for the editorial layout
const CaseStudyImage = ({ src, alt }: { src: string | undefined; alt?: string }) => {
  if (!src) return null;

  // 1. Clean path: Ensure we just have the filename (e.g., "hero.jpg")
  const filename = src.split('/').pop() || src;

  // 2. Construct full CDN URL
  const fullUrl = `${CDN_BASE}${filename}`;

  // 3. Editorial Styling
  return (
    <div className="my-12 group">
      {/* The Image Container */}
      <div className="relative w-full overflow-hidden rounded-sm border border-stone-200 bg-stone-100 shadow-sm">
         <img
            src={fullUrl}
            alt={alt}
            className="w-full h-auto object-cover transition-transform duration-700 scale-100 group-hover:scale-[1.02] grayscale hover:grayscale-0"
            onError={(e) => {
                // Fallback for debugging if CDN fails
                e.currentTarget.src = `https://placehold.co/800x450/e5e5e5/a3a3a3?text=CDN_ERR:+${filename}`;
            }}
         />
      </div>
      {/* Editorial Caption */}
      {alt && (
        <div className="mt-3 border-l border-stone-300 pl-3">
            <p className="mono-font text-[10px] uppercase tracking-[0.15em] text-stone-500">
                FIG. // {alt}
            </p>
        </div>
      )}
    </div>
  );
};

const TechTag = ({ label }: { label: string }) => {
  return (
    <motion.span 
      whileHover={{ backgroundColor: '#1c1917', color: '#ffffff' }}
      transition={{ duration: 0.2 }}
      className="inline-flex items-center px-2 py-0.5 border border-stone-900 mono-font text-[10px] uppercase tracking-widest font-bold bg-white text-stone-900 mx-1 cursor-crosshair select-none"
    >
      {label}
    </motion.span>
  );
};

interface StreamingMarkdownProps {
  content: string;
  lens: LensId;
}

const StreamingMarkdown = ({ content, lens }: StreamingMarkdownProps) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    setDisplayedText("");
    let index = 0;
    const interval = setInterval(() => {
      if (index <= content.length) {
        setDisplayedText(content.slice(0, index));
        index += Math.floor(Math.random() * 20) + 15;
      } else {
        clearInterval(interval);
      }
    }, 5);
    return () => clearInterval(interval);
  }, [content]);

  return (
    <ReactMarkdown
      components={{
        h3: ({ children }) => <h3 className="serif-font text-3xl italic mb-6 text-stone-900">{children}</h3>,
        p: ({ children }) => <p className="mb-8 sans-font text-lg leading-loose text-stone-800 font-normal">{children}</p>,
        strong: ({ children }) => <TechTag label={String(children)} />,
        ul: ({ children }) => <ul className="space-y-4 mb-10 pl-0">{children}</ul>,
        li: ({ children }) => (
          <li className="flex gap-4 items-start group">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-900 mt-2.5 shrink-0" />
            <span className="text-stone-800 leading-relaxed text-lg">{children}</span>
          </li>
        ),
        img: ({src, alt}) => <CaseStudyImage src={src} alt={alt} />
      }}
    >
      {displayedText}
    </ReactMarkdown>
  );
};

interface ViewerContextProps {
  activeLens: LensId | 'home';
  onSelect: (id: LensId | 'home') => void;
}

const ViewerContext = ({ activeLens, onSelect }: ViewerContextProps) => {
  const options = [
    { id: 'recruiter', label: 'RECRUITER_EDIT', icon: <ShieldCheck size={12} /> },
    { id: 'engineer', label: 'ENGINEER_EDIT', icon: <Cpu size={12} /> },
    { id: 'designer', label: 'DESIGNER_EDIT', icon: <Eye size={12} /> },
    { id: 'source', label: 'RAW_ARCHIVE', icon: <Archive size={12} /> }
  ];

  return (
    <nav className="flex flex-col gap-1 mt-12 relative">
      <span className="mono-font text-[9px] uppercase tracking-[0.4em] text-stone-600 mb-4 px-2 font-black">SELECT_EDITION</span>
      <LayoutGroup id="sidebarTabs">
        {options.map(item => (
          <button 
            key={item.id} 
            onClick={() => onSelect(item.id as LensId)} 
            className={`relative group flex items-center justify-between px-3 py-3 transition-colors duration-300 ${
              activeLens === item.id 
                ? 'text-white' 
                : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            {activeLens === item.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-stone-900 border-l-2 border-white -z-10"
                transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
              />
            )}
            <div className="flex items-center gap-4 relative z-10">
              {item.icon}
              <span className="mono-font text-[10px] uppercase tracking-[0.3em] font-bold">{item.label}</span>
            </div>
            <ArrowRight size={10} className={`relative z-10 opacity-0 group-hover:opacity-100 transition-opacity ${activeLens === item.id ? 'opacity-100' : ''}`} />
          </button>
        ))}
      </LayoutGroup>
    </nav>
  );
};

export default function App() {
  const [project, setProject] = useState<ProjectData>(DEFAULT_PROJECT);
  const [activeLens, setActiveLens] = useState<LensId | 'home'>('recruiter');
  const [targetLens, setTargetLens] = useState<LensId | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [rawText, setRawText] = useState('');

  const timelineData = useMemo(() => {
    if (activeLens === 'home') return [];
    const content = project.lenses[activeLens as LensId].content;
    const sections = content.split(/###\s+/).filter(s => s.trim().length > 0);
    return sections.map(section => {
      const lines = section.split('\n');
      return { title: lines[0].trim(), body: lines.slice(1).join('\n').trim() };
    });
  }, [project, activeLens]);

  const handleGenerate = async () => {
    if (!rawText.trim()) return;
    setIsGenerating(true);
    try {
      const newData = await generateLenses(rawText);
      setProject(newData);
      setShowInputModal(false);
      setRawText('');
      setActiveLens('recruiter');
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const handleLensSelect = (id: LensId | 'home') => {
    if (id === activeLens) return;
    if (id === 'home') { setActiveLens('home'); return; }
    setTargetLens(id as LensId);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col lg:flex-row overflow-x-hidden selection:bg-stone-900 selection:text-white">
      
      <AnimatePresence>
        {targetLens && <CuratingOverlay lens={targetLens} onComplete={() => { setActiveLens(targetLens); setTargetLens(null); }} />}
      </AnimatePresence>

      {/* SIDEBAR: THE SYSTEM */}
      <aside className="w-full lg:w-[320px] lg:fixed lg:h-screen lg:top-0 lg:left-0 bg-[#0a0a0a] border-r border-stone-900 z-50 p-8 flex flex-col justify-between">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-1 cursor-pointer" 
            onClick={() => setActiveLens('home')}
          >
            <h1 className="serif-font text-2xl text-white tracking-tight leading-none italic mb-2">Space & Color</h1>
            <span className="mono-font text-[8px] uppercase tracking-[0.4em] text-stone-600 font-black">VOL. 01 // CONTEXT ENGINE</span>
          </motion.div>

          <ViewerContext activeLens={activeLens} onSelect={handleLensSelect} />

          <div className="mt-16 pt-8 border-t border-stone-900">
            <span className="mono-font text-[9px] uppercase tracking-[0.4em] text-stone-600 mb-6 block font-black">ADAPTIVE_TUNING</span>
            <GenerationParams activeLens={activeLens} />
          </div>
        </div>

        <div className="pt-8 border-t border-stone-900 flex flex-col gap-6">
          <button onClick={() => setShowInputModal(true)} className="flex items-center gap-3 mono-font text-[10px] text-stone-500 hover:text-white transition-colors uppercase tracking-[0.3em] font-black group">
            <Command size={12} className="group-hover:rotate-90 transition-transform" /> ASSIGNMENT_DESK
          </button>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-stone-600 status-dot" />
            <span className="mono-font text-[9px] uppercase tracking-[0.2em] text-stone-700">LIVE_CIRCULATION</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT: THE OUTPUT */}
      <main className="flex-1 lg:ml-[320px] bg-white min-h-screen relative overflow-hidden shadow-2xl flex flex-col items-center">
        <AnimatePresence mode="wait">
          {activeLens === 'home' ? (
            <motion.div 
              key="home" 
              initial={{ opacity: 0, scale: 1.05 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              transition={dossierTransition}
              className="w-full flex-1 flex flex-col items-center justify-center p-12 text-center max-w-4xl"
            >
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mono-font text-[10px] uppercase tracking-[0.6em] text-stone-400 mb-8 block font-black"
              >
                INITIALIZING_COVER_STORY
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="serif-font text-[10vw] leading-[0.8] text-stone-900 italic tracking-tighter mb-12"
              >
                TheIssue.
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="sans-font text-xl text-stone-500 leading-loose max-w-2xl mb-16"
              >
                A live-curated editorial experience. Intelligent storytelling, tailored to your reader profile.
              </motion.p>
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                onClick={() => handleLensSelect('recruiter')} 
                className="border border-stone-900 px-10 py-4 mono-font text-[10px] font-black uppercase tracking-[0.5em] hover:bg-stone-900 hover:text-white transition-all"
              >
                READ_COVER_STORY
              </motion.button>
            </motion.div>
          ) : (
            <motion.article 
              key={activeLens} 
              initial={{ opacity: 0, y: 60, scale: 0.98 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: -20, scale: 1 }} 
              transition={dossierTransition}
              className="w-full max-w-[1400px] flex flex-col origin-top"
            >
              {/* HERO IMAGE */}
              <div className="px-8 md:px-20 pt-12">
                <CaseStudyImage src="hero.jpg" alt="Google Cloud Next '24 Keynote Stage" />
              </div>

              {/* HERO SECTION */}
              <motion.header 
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="px-8 md:px-20 py-10 md:py-20 flex flex-col gap-12 border-b border-stone-100"
              >
                <motion.div variants={fadeUpItem} className="flex items-center gap-4 text-stone-400 mono-font text-[10px] uppercase tracking-[0.5em] font-black">
                  <FileText size={14} /> EDITION::{activeLens.toUpperCase()}
                </motion.div>
                <motion.h2 variants={fadeUpItem} className="serif-font text-6xl md:text-9xl leading-[0.9] text-stone-950 font-light tracking-tightest">
                  {project.lenses[activeLens as LensId].headline}
                </motion.h2>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mt-12">
                  <motion.div variants={fadeUpItem} className="max-w-xl">
                    <span className="mono-font text-[10px] text-stone-400 uppercase tracking-[0.4em] mb-4 block font-black">EDITOR'S_NOTE</span>
                    <p className="serif-font italic text-3xl text-stone-800 leading-snug">
                      "{project.lenses[activeLens as LensId].reasoning}"
                    </p>
                  </motion.div>
                  <motion.div variants={fadeUpItem} className="bg-stone-50 p-6 border border-stone-100 min-w-[280px]">
                    <span className="mono-font text-[9px] text-stone-400 uppercase tracking-[0.4em] mb-4 block font-black">Issue_Meta</span>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px] mono-font uppercase tracking-widest font-bold">
                        <span className="text-stone-400">Status</span>
                        <span className="text-stone-900">{project.lenses[activeLens as LensId].status}</span>
                      </div>
                      <div className="flex justify-between text-[11px] mono-font uppercase tracking-widest font-bold">
                        <span className="text-stone-400">Context</span>
                        <span className="text-stone-900">Live_Circulation</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.header>

              {/* MAIN CONTENT AREA: POLISHED MARGINALIA LAYOUT */}
              <div className="px-8 md:px-20 py-20 flex flex-col gap-32">
                {timelineData.map((section, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.25, 1, 0.5, 1] }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 lg:gap-24 items-start"
                  >
                    {/* LEFT MARGIN: STICKY SECTION HEADER */}
                    <div className="lg:col-span-3 lg:sticky lg:top-24 mb-6 lg:mb-0">
                      <div className="flex flex-col gap-4">
                        <span className="mono-font text-[10px] text-stone-300 font-black tracking-[0.5em] uppercase">SECTION_{String(idx + 1).padStart(2, '0')}</span>
                        <h4 className="serif-font text-2xl md:text-4xl text-stone-950 font-normal leading-tight">{section.title}</h4>
                        <div className="h-[2px] w-12 bg-stone-900 mt-4" />
                      </div>
                    </div>

                    {/* RIGHT COLUMN: MARGINALIA CONTENT WITH CLEAR GUTTER */}
                    <div className="lg:col-span-8 lg:col-start-5 pt-1 lg:pt-0">
                      <StreamingMarkdown content={section.body} lens={activeLens as LensId} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </main>

      {/* INPUT MODAL: ASSIGNMENT_DESK */}
      {/* Fix: Ensured name is AnimatePresence to resolve "Cannot find name 'AnPresence'" error on line 414 */}
      <AnimatePresence>
        {showInputModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isGenerating && setShowInputModal(false)} className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              transition={dossierTransition}
              className="relative w-full max-w-4xl bg-white p-12 shadow-2xl border border-stone-100"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-6">
                  <Sparkles className="w-8 h-8 text-stone-900" />
                  <h2 className="serif-font text-5xl italic text-stone-950">Assignment_Desk</h2>
                </div>
                <button onClick={() => setShowInputModal(false)} className="text-stone-300 hover:text-stone-950 transition-all"><X size={32} /></button>
              </div>
              <textarea 
                value={rawText} 
                onChange={(e) => setRawText(e.target.value)} 
                placeholder="Submit raw case study manuscript for curation..." 
                className="w-full h-80 p-10 bg-stone-50 border border-stone-100 text-stone-900 outline-none resize-none serif-font text-3xl font-light mb-12 placeholder:text-stone-200 focus:bg-white transition-colors" 
              />
              <div className="flex justify-between items-center">
                <p className="mono-font text-[10px] text-stone-400 uppercase tracking-[0.3em] max-w-sm leading-relaxed">The system will analyze and typeset three custom editions based on semantic reconstruction.</p>
                <button 
                  disabled={isGenerating || !rawText.trim()} 
                  onClick={handleGenerate} 
                  className={`px-12 py-5 mono-font text-xs font-black uppercase tracking-[0.4em] transition-all ${
                    isGenerating || !rawText.trim() ? 'bg-stone-100 text-stone-300 cursor-not-allowed' : 'bg-stone-950 text-white hover:bg-stone-800'
                  }`}
                >
                  {isGenerating ? <Loader2 className="animate-spin" /> : 'Typeset_Issue'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-8 left-[360px] hidden lg:block z-[40] pointer-events-none">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mono-font text-[9px] uppercase tracking-[0.8em] text-stone-300 font-black"
        >
          PUBLISHED BY SPACE & COLOR PRESS // 2024
        </motion.span>
      </footer>
    </div>
  );
}
