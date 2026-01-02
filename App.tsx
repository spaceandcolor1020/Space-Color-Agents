
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, MotionValue, useScroll } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
  ShieldCheck, 
  Cpu, 
  Eye, 
  Award, 
  Calendar, 
  User, 
  ArrowRight,
  Fingerprint,
  Info,
  Sparkles,
  Loader2,
  Plus,
  Terminal,
  Layers,
  ChevronRight,
  Maximize2,
  Home,
  Send,
  X,
  Target,
  Crosshair
} from 'lucide-react';
import { LensId, ProjectData } from './types';
import { DEFAULT_PROJECT } from './constants';
import { generateLenses } from './services/geminiService';

// Updated Color Mapping for Cyber-Brutalist Theme
const LENS_COLORS: Record<LensId, string> = {
  engineer: "#70E24B",  // Neon Green
  recruiter: "#1F32FF", // Vivid Blue
  designer: "#FF08A7"   // Neon Pink
};

const ACCENT_COLOR_FALLBACK = "#002FA7";

const PARAM_CONFIG = {
  recruiter: [
    { label: "ABSTRACTION_LEVEL", value: 90 },
    { label: "BUSINESS_IMPACT", value: 100 },
    { label: "TECHNICAL_DEPTH", value: 15 }
  ],
  engineer: [
    { label: "ABSTRACTION_LEVEL", value: 10 },
    { label: "SYSTEM_ARCHITECTURE", value: 95 },
    { label: "BUSINESS_IMPACT", value: 40 }
  ],
  designer: [
    { label: "ABSTRACTION_LEVEL", value: 50 },
    { label: "VISUAL_FIDELITY", value: 100 },
    { label: "PROCESS_METRICS", value: 80 }
  ]
};

const LOGIC_STEPS = {
  recruiter: [
    "DETECTED_INTENT: Talent_Acquisition & Leadership_Scouting",
    "FILTERING: Removing low-level implementation details...",
    "PRIORITY_SHIFT: Amplifying '0-to-1 Strategy' & 'Business Impact'",
    "CALCULATING: ROI_Metrics... [DONE]",
    "FORMATTING: Executive_Summary (Brevity_Mode: ON)",
    "STATUS: Ready for non-technical review."
  ],
  engineer: [
    "DETECTED_INTENT: Technical_Feasibility & System_Architecture",
    "FETCHING: 'Glass_Box_Trust_Model' logic flows...",
    "EXPANDING: AIOps & Observability stack details...",
    "ANALYSIS: Surfacing 'Agentic Readiness' standards",
    "METRICS_OVERLAY: Latency (142ms) & Token_Optimization",
    "STATUS: Decompressing technical specifications."
  ],
  designer: [
    "DETECTED_INTENT: UX_Methodology & Interaction_Patterns",
    "LOADING_ASSETS: Figma_Comps, Process_Decks, User_Journeys...",
    "HIGHLIGHTING: 'Insight Speed' vs 'Query Speed' rationale",
    "TRACING: Evolution of the 'Context Engine' design system",
    "CHECKING: Accessibility & Contrast_Ratios... [PASS]",
    "STATUS: Rendering visual narrative."
  ]
};

// --- CYBER-BRUTALIST: TECH TAG COMPONENT ---
const TechTag = ({ label, activeLens }: { label: string; activeLens: LensId }) => {
  const color = LENS_COLORS[activeLens];

  return (
    <motion.span
      whileHover={{ 
        backgroundColor: `${color}15`, 
        boxShadow: `0 0 12px -1px ${color}60` 
      }}
      className="inline-flex items-center px-3 py-1.5 rounded-[4px] border mono-font text-[10px] uppercase tracking-wider font-bold transition-all cursor-default"
      style={{
        borderColor: color,
        color: color,
        boxShadow: `0 0 8px -1px ${color}40`,
        backgroundColor: `${color}05`,
      }}
    >
      {label}
    </motion.span>
  );
};

// --- BRUTALIST UI: PERSPECTIVE SWAP MODULAR BLOCK ---
const PerspectiveSwap = ({ 
  activeLens, 
  onSelect 
}: { 
  activeLens: LensId | 'home', 
  onSelect: (id: LensId | 'home') => void 
}) => {
  const items = [
    { id: 'recruiter', icon: <ShieldCheck size={14} />, label: 'Recruiter' },
    { id: 'engineer', icon: <Cpu size={14} />, label: 'Engineer' },
    { id: 'designer', icon: <Eye size={14} />, label: 'Designer' }
  ];

  return (
    <div className="flex flex-col gap-1 pointer-events-auto">
      <span className="mono-font text-[9px] uppercase tracking-[0.4em] text-stone-400 mb-2 px-2">Perspective_Swap</span>
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id as LensId)}
          className={`flex items-center gap-3 px-3 py-2 transition-all border ${
            activeLens === item.id 
              ? 'bg-stone-900 border-stone-900 text-white shadow-lg' 
              : 'bg-white border-stone-100 text-stone-400 hover:border-stone-300'
          }`}
        >
          {item.icon}
          <span className="mono-font text-[10px] uppercase tracking-widest font-bold">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

// --- TECHNICAL UI: GENERATION PARAMS PANEL ---
const GenerationParams = ({ activeLens }: { activeLens: LensId }) => {
  const params = PARAM_CONFIG[activeLens] || [];
  const barColor = LENS_COLORS[activeLens];

  return (
    <div className="flex flex-col gap-5 p-4 bg-stone-50/50 border border-stone-100 rounded-[1px] shadow-sm">
      <h4 className="mono-font text-[9px] uppercase tracking-[0.4em] text-stone-400 font-black mb-2 flex items-center gap-2">
        <Target size={10} className="text-stone-300" />
        [ GENERATION_PARAMS ]
      </h4>
      <div className="space-y-4">
        {params.map((param, idx) => (
          <div key={param.label} className="space-y-2">
            <div className="flex justify-between items-center mono-font text-[10px] tracking-widest text-stone-500 font-medium">
              <span>{param.label}</span>
              <span className="text-stone-300">[{param.value}%]</span>
            </div>
            <div className="h-1 w-full bg-stone-200/50 rounded-full overflow-hidden">
              <motion.div
                initial={false}
                animate={{ width: `${param.value}%`, backgroundColor: barColor }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="h-full rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- THINKING OVERLAY COMPONENT (REASONING LOADER) ---
const ThinkingOverlay = ({ lens, onComplete }: { lens: LensId, onComplete: () => void }) => {
  const steps = LOGIC_STEPS[lens];
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    if (visibleSteps < steps.length) {
      const timer = setTimeout(() => {
        setVisibleSteps(prev => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 400);
      return () => clearTimeout(timer);
    }
  }, [visibleSteps, steps.length, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-stone-950/20 backdrop-blur-md"
    >
      <div className="bg-[#050505] border border-stone-800 p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] max-w-xl w-full relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        
        <div className="flex justify-between items-center mb-8 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <Terminal size={14} className="text-[#00ff41]" />
            <span className="mono-font text-[10px] text-stone-400 uppercase tracking-[0.4em] font-bold">
              Reasoning_Engine // Perspective::{lens.toUpperCase()}
            </span>
          </div>
          <div className="w-1.5 h-1.5 bg-[#00ff41] animate-pulse shadow-[0_0_8px_#00ff41]" />
        </div>

        <div className="mono-font text-[#00ff41] text-[11px] space-y-4 uppercase tracking-widest leading-relaxed">
          {steps.slice(0, visibleSteps).map((step, i) => (
            <div key={i} className="flex gap-4 group">
              <span className="text-stone-700 select-none">[{String(i+1).padStart(2, '0')}]</span>
              <span className="flex-1">
                {step}
                {i === visibleSteps - 1 ? (
                  <span className="inline-block w-2.5 h-4 bg-[#00ff41] ml-2 align-middle animate-[reasoner-blink_0.8s_infinite]">█</span>
                ) : (
                  <span className="ml-2 text-stone-800 opacity-50">✓</span>
                )}
              </span>
            </div>
          ))}
          
          {visibleSteps < steps.length && (
            <div className="flex gap-4 opacity-20">
               <span className="text-stone-800">[{String(visibleSteps+1).padStart(2, '0')}]</span>
               <span className="italic">WAITING_FOR_DATA_STREAM...</span>
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-between items-center">
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="w-8 h-1 bg-stone-800 overflow-hidden relative"
              >
                {visibleSteps > (i * (steps.length / 3)) && (
                   <motion.div 
                     initial={{ x: "-100%" }} 
                     animate={{ x: "0%" }} 
                     className="absolute inset-0 bg-[#00ff41]" 
                   />
                )}
              </div>
            ))}
          </div>
          <span className="mono-font text-[8px] text-stone-700 tracking-[0.5em]">0x91F_MODULATE_READY</span>
        </div>

        <style>{`
          @keyframes reasoner-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        `}</style>
      </div>
    </motion.div>
  );
};

// --- ACETERNITY UI: TIMELINE ---
const Timeline = ({ data }: { data: { title: string; content: React.ReactNode }[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full bg-transparent mono-font mt-20" ref={containerRef}>
      <div className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-20 md:pt-40 gap-10">
            <div className="sticky flex flex-col items-center top-40 self-start z-40">
              <div className="h-12 w-12 bg-white flex items-center justify-center border border-stone-200">
                <div className="h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]" style={{ backgroundColor: ACCENT_COLOR_FALLBACK }} />
              </div>
            </div>

            <div className="relative w-full">
              <h3 className="text-3xl md:text-5xl font-light text-[#1A1A1A] serif-font italic mb-10">
                {item.title}
              </h3>
              <div className="text-stone-900 leading-relaxed">
                {item.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [project, setProject] = useState<ProjectData>(DEFAULT_PROJECT);
  const [activeLens, setActiveLens] = useState<LensId | 'home'>('recruiter');
  const [targetLens, setTargetLens] = useState<LensId | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [rawText, setRawText] = useState('');

  const currentAccent = activeLens !== 'home' ? LENS_COLORS[activeLens as LensId] : ACCENT_COLOR_FALLBACK;

  const handleGenerate = async () => {
    if (!rawText.trim()) return;
    setIsGenerating(true);
    try {
      const newData = await generateLenses(rawText);
      setProject(newData);
      setShowInputModal(false);
      setRawText('');
      setActiveLens('recruiter');
    } catch (error) {
      console.error(error);
      alert("Analysis failure.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLensSelect = (id: LensId | 'home') => {
    if (id === 'home') {
      setActiveLens('home');
      setTargetLens(null);
      return;
    }
    if (id === activeLens) return;
    
    setTargetLens(id as LensId);
  };

  // --- UTILITIES (Moved inside App to access activeLens state) ---
  const parseMarkdownToTimeline = (content: string, lens: LensId) => {
    const sections = content.split(/###\s+/).filter(s => s.trim().length > 0);
    return sections.map(section => {
      const lines = section.split('\n');
      const title = lines[0].trim();
      const body = lines.slice(1).join('\n').trim();
      return { 
        title, 
        content: (
          <div className="prose prose-stone max-w-[65ch] prose-p:text-stone-700 prose-li:text-stone-600 prose-p:leading-relaxed">
            <ReactMarkdown
              components={{
                li: ({ children }) => (
                  <li className="flex gap-4 mb-4 text-[15px] group">
                    <ChevronRight className="w-4 h-4 mt-1 shrink-0" style={{ color: LENS_COLORS[lens] }} />
                    <span>{children}</span>
                  </li>
                ),
                ul: ({ children }) => <ul className="space-y-2 mb-8 list-none p-0">{children}</ul>,
                // Refactor Bold items into TechTags
                strong: ({ children }) => {
                  const label = String(children);
                  // Only wrap if it's likely a tag (shorter text) or if we want global tag aesthetics
                  return <TechTag label={label} activeLens={lens} />;
                },
                p: ({ children }) => <p className="mb-6 font-medium">{children}</p>,
                code: ({ children }) => <code className="bg-stone-50 px-1.5 py-0.5 rounded mono-font text-[13px] border border-stone-200 text-stone-900">{children}</code>
              }}
            >
              {body}
            </ReactMarkdown>
          </div>
        ) 
      };
    });
  };

  const currentLens = activeLens !== 'home' ? project.lenses[activeLens as LensId] : null;
  const timelineData = useMemo(() => {
    if (!currentLens || activeLens === 'home') return [];
    return parseMarkdownToTimeline(currentLens.content, activeLens as LensId);
  }, [currentLens, activeLens]);

  return (
    <div className="min-h-screen bg-[#050505] text-stone-200 sans-font selection:bg-stone-950 selection:text-white">
      <style>{`
        ::selection { background-color: ${currentAccent}; color: white; }
        .grid-bg { background-image: radial-gradient(circle, #1c1c1c 1px, transparent 1px); background-size: 30px 30px; }
      `}</style>

      <AnimatePresence>
        {targetLens && (
          <ThinkingOverlay 
            lens={targetLens} 
            onComplete={() => {
              setActiveLens(targetLens);
              setTargetLens(null);
            }} 
          />
        )}
      </AnimatePresence>

      <header className="fixed top-0 left-0 right-0 z-[60] px-12 py-8 flex justify-between items-center mix-blend-difference">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 bg-white flex items-center justify-center cursor-pointer" onClick={() => handleLensSelect('home')}>
            <span className="text-black text-base font-black serif-font">S+C</span>
          </div>
          <div className="hidden md:block">
            <h1 className="serif-font text-xl text-white tracking-tight leading-none mb-1">Ashley Golen Johnston</h1>
            <span className="mono-font text-[8px] uppercase tracking-[0.4em] text-stone-500">Context Engine v3.3.0</span>
          </div>
        </div>
        <div className="flex items-center gap-10">
          <button onClick={() => setShowInputModal(true)} className="mono-font text-[10px] uppercase tracking-widest text-white border-b border-white pb-1">Ingest_Log</button>
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full status-dot" style={{ backgroundColor: currentAccent }} />
             <span className="mono-font text-[9px] uppercase tracking-[0.2em] text-stone-400">Sync_Active</span>
          </div>
        </div>
      </header>

      <main className="relative pt-32 pb-64 px-12 max-w-[1900px] mx-auto min-h-screen grid-bg">
        
        <AnimatePresence mode="wait">
          {activeLens === 'home' ? (
             <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center pt-40 text-center">
                <h2 className="serif-font text-[12vw] text-white leading-none tracking-tighter italic mb-12">
                   Glass<br/>Box.
                </h2>
                <div className="max-w-xl mono-font text-xs uppercase tracking-[0.4em] text-stone-500 leading-relaxed mb-16">
                  Architecting trust through verifiable system evidence. A multi-lens dossier experience.
                </div>
                <button onClick={() => handleLensSelect('recruiter')} className="bg-white text-black px-12 py-4 mono-font text-xs font-bold uppercase tracking-[0.4em] hover:bg-stone-200 transition-colors">Launch_Engine</button>
             </motion.div>
          ) : (
            <motion.div key={activeLens} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative bg-white min-h-[150vh] p-8 md:p-24 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.2)] flex gap-16">
              
              <aside className={`sticky top-24 self-start h-fit z-50 flex flex-col gap-10 hidden xl:flex min-w-[220px] mr-16 transition-all ${targetLens ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={12} className="text-stone-400" />
                    <span className="mono-font text-[9px] uppercase tracking-[0.4em] text-stone-400 font-bold">Identity_Epoch</span>
                  </div>
                  <div className="p-4 bg-white border border-stone-100 shadow-sm w-48">
                    <span className="block mono-font text-[8px] text-stone-400 uppercase mb-1">Position</span>
                    <span className="block serif-font text-sm text-stone-900 leading-tight">{project.meta.role}</span>
                    <div className="h-px w-full bg-stone-100 my-3" />
                    <span className="block mono-font text-[8px] text-stone-400 uppercase mb-1">Timeline</span>
                    <span className="block serif-font text-sm text-stone-900">{project.meta.timeline}</span>
                  </div>
                </div>
                
                <PerspectiveSwap activeLens={activeLens} onSelect={handleLensSelect} />
                <GenerationParams activeLens={activeLens as LensId} />

                <div className="flex flex-col gap-3">
                  <span className="mono-font text-[9px] uppercase tracking-[0.4em] text-stone-400 font-bold px-2">Merit_Registry</span>
                  <div className="space-y-1">
                    {project.meta.awards.map(a => (
                      <div key={a} className="bg-stone-50 text-[10px] mono-font p-2 text-stone-400 border border-stone-100 uppercase tracking-widest leading-none">
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              <div className={`flex-1 min-w-0 transition-all duration-500 ${targetLens ? 'backdrop-blur-sm grayscale opacity-30 pointer-events-none' : ''}`}>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 mb-40">
                  <div className="lg:col-span-12 flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                      <Crosshair size={16} style={{ color: currentAccent }} />
                      <span className="mono-font text-[10px] uppercase tracking-[0.5em] text-stone-400 font-bold">
                        [ Perspective::{activeLens.toUpperCase()} ]
                      </span>
                    </div>
                    <div className="hidden lg:block w-32 h-[1px] bg-stone-100" />
                  </div>

                  <div className="lg:col-span-8 relative z-20">
                    <h2 className="serif-font text-[6vw] leading-[0.95] text-stone-900 font-light tracking-tightest mb-0">
                      {currentLens?.headline}
                    </h2>
                  </div>

                  <div className="lg:col-span-4 lg:-ml-20 lg:mt-24">
                    <div className="p-8 bg-stone-50 border border-stone-100 relative group">
                      <div className="absolute top-0 right-0 p-2 opacity-20"><Target size={14} /></div>
                      <span className="mono-font text-[9px] uppercase tracking-[0.4em] text-stone-400 mb-6 block font-black">Agency_Log.txt</span>
                      <p className="mono-font text-[11px] uppercase tracking-widest font-bold mb-4" style={{ color: currentAccent }}>{currentLens?.status}</p>
                      <div className="flex justify-end pt-4 border-t border-stone-100">
                        <Fingerprint className="w-6 h-6 opacity-20" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative py-32 mb-40 border-y border-stone-100">
                  <div className="absolute top-0 left-0 p-4 mono-font text-[10px] text-stone-300 tracking-[1em]">RATIONALE</div>
                  <blockquote className="serif-font italic text-[4vw] text-[#1A1A1A] leading-[1.1] text-center max-w-6xl mx-auto">
                    "{currentLens?.reasoning}"
                  </blockquote>
                  <div className="absolute bottom-0 right-0 p-4 mono-font text-[10px] text-stone-300 tracking-[1em]">0x91F_MODULATE</div>
                </div>

                <Timeline data={timelineData} />

                {currentLens?.artifact && (
                  <div className="mt-64 relative border-t-2 border-stone-900 pt-24">
                    <div className="absolute -top-3 left-0 bg-stone-900 text-white px-3 py-1 mono-font text-[10px] tracking-widest font-bold">ARTIFACT_NODE</div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                      <div className="lg:col-span-4 flex flex-col justify-center">
                        <span className="mono-font text-[10px] text-stone-400 uppercase tracking-[0.4em] mb-4">Recommended Visualization</span>
                        <p className="serif-font text-2xl text-stone-900 leading-snug mb-8">{currentLens.artifact}</p>
                        <div className="flex gap-4">
                            <div className="w-10 h-px bg-stone-900 mt-3" />
                            <button className="mono-font text-[10px] uppercase font-bold tracking-widest text-stone-400 hover:text-black transition-colors">Expand_Data</button>
                        </div>
                      </div>
                      <div className="lg:col-span-8">
                        <div className="aspect-video bg-stone-50 border border-stone-100 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-10 blur-3xl rounded-full scale-150 transition-transform group-hover:scale-110 duration-700" style={{ backgroundColor: currentAccent }} />
                            <Maximize2 className="relative z-10 text-stone-200 group-hover:text-stone-900 transition-colors" size={48} strokeWidth={0.5} />
                            <div className="absolute bottom-4 left-4 mono-font text-[8px] text-stone-300">RENDER_V_4.2.1</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showInputModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isGenerating && setShowInputModal(false)} className="absolute inset-0 bg-white/95 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="relative w-full max-w-5xl bg-stone-950 p-12 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-6">
                  <Sparkles className="w-8 h-8" style={{ color: currentAccent }} />
                  <h2 className="serif-font text-4xl italic text-white">Ingestion_Pipeline</h2>
                </div>
                <button onClick={() => setShowInputModal(false)} className="text-stone-700 hover:text-white transition-all"><X size={32} /></button>
              </div>
              <textarea value={rawText} onChange={(e) => setRawText(e.target.value)} placeholder="Provide raw case study metadata..." className="w-full h-80 p-8 bg-stone-900 border border-white/5 text-stone-200 outline-none resize-none serif-font text-2xl font-light mb-12" />
              <div className="flex justify-between items-center">
                 <p className="mono-font text-[10px] text-stone-500 uppercase tracking-widest max-w-md leading-relaxed">System will architect three contextual lenses using probabilistic semantic reconstruction.</p>
                 <button disabled={isGenerating || !rawText.trim()} onClick={handleGenerate} className={`px-12 py-4 mono-font text-xs font-black uppercase tracking-[0.4em] transition-all ${isGenerating || !rawText.trim() ? 'bg-stone-800 text-stone-700 cursor-not-allowed' : 'bg-white text-black hover:bg-stone-200'}`}>
                    {isGenerating ? <Loader2 className="animate-spin" /> : 'Execute_Build'}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="px-12 py-20 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] mono-font text-stone-800 uppercase tracking-[0.6em] font-black border-t border-white/5">
        <p>© ASJH CONTEXT ENGINE // SPACE & COLOR 2024</p>
        <div className="flex gap-20">
          <span className="hover:text-stone-300 cursor-pointer transition-colors border-b border-stone-900 hover:border-stone-700 pb-1">Architectural_Manifesto</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
