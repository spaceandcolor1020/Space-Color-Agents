
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
  ShieldCheck, 
  Cpu, 
  Eye, 
  Award, 
  ArrowRight,
  Fingerprint,
  Sparkles,
  Loader2,
  Terminal,
  ChevronRight,
  Maximize2,
  X,
  Target,
  Crosshair,
  Layers,
  Activity,
  Scan,
  Database,
  Archive
} from 'lucide-react';
import { LensId, ProjectData } from './types';
import { DEFAULT_PROJECT } from './constants';
import { generateLenses } from './services/geminiService';

// --- STYLING CONSTANTS ---
const LENS_COLORS: Record<LensId, string> = {
  engineer: "#70E24B",  // Neon Green
  recruiter: "#1F32FF", // Vivid Blue
  designer: "#FF08A7",  // Neon Pink
  source: "#F59E0B"     // Amber (Archive/Warning)
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
  ],
  source: [] // No dynamic tuning for source
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
  ],
  source: [
    "SYSTEM_OVERRIDE: Manual_Audit_Mode_Engaged",
    "BYPASSING: All context-aware filters",
    "RETRIEVING: Full chronological record from disk...",
    "DECOMPRESSING: Legacy_Project_Archive",
    "VERIFYING: Data integrity... [100%]",
    "STATUS: Displaying raw source telemetry."
  ]
};

// --- COMPONENTS ---

const TechTag = ({ label, activeLens }: { label: string; activeLens: LensId }) => {
  const color = LENS_COLORS[activeLens];
  return (
    <motion.span
      whileHover={{ backgroundColor: `${color}15`, boxShadow: `0 0 12px -1px ${color}60` }}
      className="inline-flex items-center px-3 py-1.5 rounded-[4px] border mono-font text-[10px] uppercase tracking-wider font-bold transition-all cursor-default"
      style={{ borderColor: color, color: color, boxShadow: `0 0 8px -1px ${color}40`, backgroundColor: `${color}05` }}
    >
      {label}
    </motion.span>
  );
};

const StreamingMarkdown = ({ content, lens }: { content: string; lens: LensId }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    setDisplayedText("");
    let index = 0;
    const interval = setInterval(() => {
      if (index <= content.length) {
        setDisplayedText(content.slice(0, index));
        index += Math.floor(Math.random() * 12) + 6;
      } else {
        clearInterval(interval);
      }
    }, 8);
    return () => clearInterval(interval);
  }, [content]);

  return (
    <ReactMarkdown
      components={{
        li: ({ children }) => (
          <li className="flex gap-4 mb-4 text-[15px] group">
            <ChevronRight className="w-4 h-4 mt-1 shrink-0" style={{ color: LENS_COLORS[lens] }} />
            <span className="text-[#1a1a1a]">{children}</span>
          </li>
        ),
        ul: ({ children }) => <ul className="space-y-2 mb-8 list-none p-0">{children}</ul>,
        strong: ({ children }) => <TechTag label={String(children)} activeLens={lens} />,
        p: ({ children }) => <p className="mb-6 font-medium text-[#1a1a1a]">{children}</p>,
        code: ({ children }) => <code className="bg-stone-50 px-1.5 py-0.5 rounded mono-font text-[13px] border border-stone-200 text-[#1a1a1a]">{children}</code>
      }}
    >
      {displayedText}
    </ReactMarkdown>
  );
};

const GenerationParams = ({ activeLens }: { activeLens: LensId | 'home' }) => {
  const isHome = activeLens === 'home';
  const isSource = activeLens === 'source';
  const currentParams = isHome || isSource ? [] : (PARAM_CONFIG[activeLens as LensId] || []);
  const barColor = isHome ? "#333" : LENS_COLORS[activeLens as LensId];
  const [jitter, setJitter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setJitter((Math.random() - 0.5) * 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={false}
      animate={{ 
        borderColor: isHome ? '#292524' : isSource ? '#555' : `${barColor}80`,
        boxShadow: isHome ? 'none' : isSource ? 'none' : `0 0 25px -5px ${barColor}20`
      }}
      className={`flex flex-col gap-5 p-4 bg-stone-900/30 border rounded-[1px] transition-all duration-700 relative overflow-hidden ${isSource ? 'opacity-60' : ''}`}
    >
      <h4 className="mono-font text-[9px] uppercase tracking-[0.4em] text-stone-500 font-black mb-2 flex items-center gap-2">
        <Activity size={10} className={`${!isHome && !isSource ? 'animate-pulse' : ''}`} style={{ color: !isHome ? barColor : '#444' }} />
        [ ADAPTIVE_TUNING ]
      </h4>
      <div className="space-y-4">
        {currentParams.map((param) => (
          <div key={param.label} className="space-y-2">
            <div className="flex justify-between items-center mono-font text-[10px] tracking-widest text-stone-400 font-medium">
              <span>{param.label}</span>
              <span className="text-stone-600">[{Math.round(param.value + jitter)}%]</span>
            </div>
            <div className="h-1 w-full bg-stone-800/50 rounded-full overflow-hidden">
              <motion.div
                initial={false}
                animate={{ width: `${Math.min(100, Math.max(0, param.value + jitter))}%`, backgroundColor: barColor }}
                transition={{ type: "spring", stiffness: 50, damping: 15 }}
                className="h-full rounded-full opacity-80"
              />
            </div>
          </div>
        ))}
        {isHome && (
          <div className="py-4 text-center mono-font text-[8px] text-stone-700 uppercase tracking-widest">
            Awaiting_Lens_Selection...
          </div>
        )}
        {isSource && (
          <div className="py-6 flex flex-col items-center gap-4">
             <div className="w-full h-1 bg-stone-800/50" />
             <span className="mono-font text-[9px] text-amber-600 font-black uppercase tracking-[0.4em] text-center">
                [ MANUAL_OVERRIDE_ACTIVE ]
             </span>
             <div className="w-full h-1 bg-stone-800/50" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ThinkingOverlay = ({ lens, onComplete }: { lens: LensId, onComplete: () => void }) => {
  const steps = LOGIC_STEPS[lens];
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    if (visibleSteps < steps.length) {
      const timer = setTimeout(() => setVisibleSteps(prev => prev + 1), 300);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 400);
      return () => clearTimeout(timer);
    }
  }, [visibleSteps, steps.length, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-stone-950/40 backdrop-blur-md"
    >
      <div className="bg-[#050505] border border-stone-800 p-10 shadow-2xl max-w-xl w-full relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        <div className="flex justify-between items-center mb-8 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <Terminal size={14} className="text-[#00ff41]" />
            <span className="mono-font text-[10px] text-stone-400 uppercase tracking-[0.4em] font-bold">Reasoning_Engine // {lens.toUpperCase()}</span>
          </div>
          <div className="w-1.5 h-1.5 bg-[#00ff41] animate-pulse shadow-[0_0_8px_#00ff41]" />
        </div>
        <div className="mono-font text-[#00ff41] text-[11px] space-y-4 uppercase tracking-widest leading-relaxed">
          {steps.slice(0, visibleSteps).map((step, i) => (
            <div key={i} className="flex gap-4 group">
              <span className="text-stone-700 select-none">[{String(i+1).padStart(2, '0')}]</span>
              <span className="flex-1">{step}{i === visibleSteps - 1 ? <span className="inline-block w-2.5 h-4 bg-[#00ff41] ml-2 align-middle animate-pulse">█</span> : <span className="ml-2 text-stone-800 opacity-50">✓</span>}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ViewerContext = ({ activeLens, onSelect }: { activeLens: LensId | 'home', onSelect: (id: LensId | 'home') => void }) => {
  const personas = [
    { id: 'recruiter', icon: <ShieldCheck size={14} />, label: 'Recruiter' },
    { id: 'engineer', icon: <Cpu size={14} />, label: 'Engineer' },
    { id: 'designer', icon: <Eye size={14} />, label: 'Designer' }
  ];
  
  const system = [
    { id: 'source', icon: <Archive size={14} />, label: 'SOURCE_DATA' }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="mono-font text-[9px] uppercase tracking-[0.4em] text-stone-600 mb-2 px-2">SYSTEM_MODE</span>
        {system.map(item => (
          <button 
            key={item.id} 
            onClick={() => onSelect(item.id as LensId)} 
            className={`flex items-center gap-3 px-3 py-2 transition-all border ${activeLens === item.id ? 'bg-amber-600 border-amber-600 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-transparent border-stone-800 text-stone-500 hover:border-amber-900/50 hover:text-amber-500'}`}
          >
            {item.icon}<span className="mono-font text-[10px] uppercase tracking-widest font-black">{item.label}</span>
          </button>
        ))}
      </div>
      
      <div className="h-px w-full border-t border-dashed border-stone-800" />
      
      <div className="flex flex-col gap-1">
        <span className="mono-font text-[9px] uppercase tracking-[0.4em] text-stone-500 mb-2 px-2">VIEWER_CONTEXT</span>
        {personas.map(item => (
          <button 
            key={item.id} 
            onClick={() => onSelect(item.id as LensId)} 
            className={`flex items-center gap-3 px-3 py-2 transition-all border ${activeLens === item.id ? 'bg-stone-100 border-stone-100 text-stone-900 shadow-lg' : 'bg-transparent border-stone-800 text-stone-500 hover:border-stone-600 hover:text-stone-300'}`}
          >
            {item.icon}<span className="mono-font text-[10px] uppercase tracking-widest font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// --- APP ---

export default function App() {
  const [project, setProject] = useState<ProjectData>(DEFAULT_PROJECT);
  const [activeLens, setActiveLens] = useState<LensId | 'home'>('recruiter');
  const [targetLens, setTargetLens] = useState<LensId | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [rawText, setRawText] = useState('');
  const [expandedArtifact, setExpandedArtifact] = useState(false);

  const currentAccent = activeLens !== 'home' ? LENS_COLORS[activeLens as LensId] : ACCENT_COLOR_FALLBACK;

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
    <LayoutGroup>
      <div className="min-h-screen bg-[#050505] text-stone-200 sans-font selection:bg-stone-900 selection:text-white flex flex-col overflow-x-hidden">
        <style>{` ::selection { background-color: ${currentAccent}; color: white; } .grid-bg { background-image: radial-gradient(circle, #1c1c1c 1px, transparent 1px); background-size: 30px 30px; } `}</style>

        <AnimatePresence>{targetLens && <ThinkingOverlay lens={targetLens} onComplete={() => { setActiveLens(targetLens); setTargetLens(null); }} />}</AnimatePresence>

        <header className="fixed top-0 left-0 right-0 z-[60] px-12 py-8 flex justify-between items-center mix-blend-difference">
          <div className="flex items-center gap-6 cursor-pointer" onClick={() => handleLensSelect('home')}>
            <div className="w-10 h-10 bg-white flex items-center justify-center"><span className="text-black text-[10px] tracking-widest font-black mono-font">INDEX</span></div>
            <div className="hidden md:block">
              <h1 className="serif-font text-xl text-white tracking-tight leading-none mb-1">Ashley Golen Johnston</h1>
              <span className="mono-font text-[8px] uppercase tracking-[0.4em] text-stone-500">Context Engine v4.9.2</span>
            </div>
          </div>
          <div className="flex items-center gap-10">
            <button onClick={() => setShowInputModal(true)} className="mono-font text-[10px] uppercase tracking-widest text-white border-b border-white pb-1">SOURCE_DATA</button>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full status-dot" style={{ backgroundColor: currentAccent }} />
              <span className="mono-font text-[9px] uppercase tracking-[0.2em] text-stone-400">Sync_Active</span>
            </div>
          </div>
        </header>

        <main className="relative pt-32 w-full flex-grow flex flex-col lg:flex-row min-h-screen">
          <aside className="w-full lg:w-[28%] xl:w-[25%] lg:sticky lg:top-32 h-fit lg:h-[calc(100vh-128px)] px-12 pb-12 flex flex-col gap-10 z-40">
            <AnimatePresence mode="wait">
              {activeLens !== 'home' ? (
                <motion.div key="active-sidebar" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="p-5 bg-stone-900/40 border border-stone-800">
                    <span className="block mono-font text-[8px] text-stone-600 uppercase mb-1">Position</span>
                    <span className="block serif-font text-sm text-stone-200 leading-tight">{project.meta.role}</span>
                    <div className="h-px w-full bg-stone-800 my-4" />
                    <span className="block mono-font text-[8px] text-stone-600 uppercase mb-1">Period</span>
                    <span className="block serif-font text-sm text-stone-200">{project.meta.timeline}</span>
                  </div>
                  <ViewerContext activeLens={activeLens} onSelect={handleLensSelect} />
                  <GenerationParams activeLens={activeLens} />
                  <div className="space-y-1">
                    <span className="mono-font text-[9px] uppercase tracking-[0.4em] text-stone-500 px-2 block mb-2">Merit_Archive</span>
                    {project.meta.awards.map(a => <div key={a} className="bg-stone-900/40 text-[10px] mono-font p-2 text-stone-500 border border-stone-800 uppercase tracking-widest">{a}</div>)}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="home-sidebar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-20">
                  <div className="h-px w-12 bg-stone-800 mb-8" />
                  <p className="mono-font text-[9px] uppercase tracking-[0.5em] text-stone-600 leading-loose">SYSTEM_IDLE<br/>AWAITING_INPUT<br/>ENGINE_READY</p>
                  <div className="mt-12"><GenerationParams activeLens="home" /></div>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>

          <section className="flex-1 relative z-10 min-h-screen">
            <AnimatePresence mode="wait">
              {activeLens === 'home' ? (
                <motion.div key="home-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center pt-40 lg:pt-60 text-center px-12 h-full">
                  <h2 className="serif-font text-[10vw] text-white leading-none tracking-tighter italic mb-12">Glass<br/>Box.</h2>
                  <div className="max-w-xl mono-font text-xs uppercase tracking-[0.4em] text-stone-500 leading-relaxed mb-16">Architecting trust through verifiable system evidence. A multi-lens dossier experience.</div>
                  <button onClick={() => handleLensSelect('recruiter')} className="bg-white text-black px-12 py-4 mono-font text-xs font-black uppercase tracking-[0.4em] hover:bg-stone-200">Launch_Engine</button>
                </motion.div>
              ) : (
                <motion.div key={activeLens} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.8 }} className="bg-white min-h-screen p-8 md:p-24 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
                  <div className="max-w-5xl mx-auto text-[#1a1a1a]">
                    <header className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-40">
                      <div className="lg:col-span-12 flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                          <Crosshair size={16} style={{ color: currentAccent }} />
                          <span className="mono-font text-[10px] uppercase tracking-[0.5em] text-stone-400 font-bold">[ Perspective::{activeLens.toUpperCase()} ]</span>
                        </div>
                      </div>
                      <div className="lg:col-span-8"><h2 className="serif-font text-[6vw] leading-[0.95] text-[#1a1a1a] font-light tracking-tightest mb-0">{project.lenses[activeLens as LensId].headline}</h2></div>
                      <div className="lg:col-span-4 lg:mt-24">
                        <div className="p-8 bg-stone-50 border border-stone-100 relative">
                          <span className="mono-font text-[9px] uppercase tracking-[0.4em] text-stone-400 mb-6 block font-black">Agency_Log.txt</span>
                          <p className="mono-font text-[11px] uppercase tracking-widest font-bold mb-4" style={{ color: currentAccent }}>{project.lenses[activeLens as LensId].status}</p>
                          <div className="flex justify-end pt-4 border-t border-stone-100"><Fingerprint className="w-6 h-6 opacity-10 text-stone-900" /></div>
                        </div>
                      </div>
                    </header>

                    <div className="relative py-32 mb-40 border-y border-stone-100">
                      <blockquote className="serif-font italic text-[4vw] text-[#1A1A1A] leading-[1.1] text-center max-w-4xl mx-auto">"{project.lenses[activeLens as LensId].reasoning}"</blockquote>
                    </div>

                    <div className="space-y-40">
                      {timelineData.map((item, i) => (
                        <div key={i} className="flex gap-10">
                          <div className="sticky top-40 self-start h-12 w-12 bg-white flex items-center justify-center border border-stone-100"><div className="h-2 w-2 rounded-full" style={{ backgroundColor: currentAccent }} /></div>
                          <div className="flex-1">
                            <h3 className="text-3xl md:text-5xl font-light text-[#1A1A1A] serif-font italic mb-10">{item.title}</h3>
                            <StreamingMarkdown content={item.body} lens={activeLens as LensId} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {project.lenses[activeLens as LensId].artifact && (
                      <div className="mt-64 relative border-t-2 border-stone-900 pt-24">
                        <div className="absolute -top-3 left-0 bg-stone-900 text-white px-3 py-1 mono-font text-[10px] tracking-widest font-bold">ARTIFACT_NODE</div>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                          <div className="lg:col-span-4 flex flex-col justify-center">
                            <span className="mono-font text-[10px] text-stone-400 uppercase tracking-[0.4em] mb-4">Recommended Visualization</span>
                            <p className="serif-font text-2xl text-[#1a1a1a] leading-snug mb-8">{project.lenses[activeLens as LensId].artifact}</p>
                            <button onClick={() => setExpandedArtifact(true)} className="flex items-center gap-4 mono-font text-[10px] uppercase font-bold tracking-widest text-stone-400 hover:text-black transition-colors">
                              <div className="w-10 h-px bg-stone-200 group-hover:bg-black" /> Expand_Data
                            </button>
                          </div>
                          <div className="lg:col-span-8">
                            <motion.div layoutId="artifact-card" onClick={() => setExpandedArtifact(true)} className="aspect-video bg-stone-50 border border-stone-100 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                              <div className="absolute inset-0 opacity-10 blur-3xl rounded-full scale-150 transition-transform group-hover:scale-110 duration-700" style={{ backgroundColor: currentAccent }} />
                              <Maximize2 className="relative z-10 text-stone-200 group-hover:text-stone-900 transition-colors" size={48} strokeWidth={0.5} />
                              <div className="absolute bottom-4 left-4 mono-font text-[8px] text-stone-300 uppercase tracking-widest">Render_v_4.2.1</div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </main>

        <AnimatePresence>
          {expandedArtifact && activeLens !== 'home' && project.lenses[activeLens as LensId].artifact && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-8">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setExpandedArtifact(false)} className="absolute inset-0 bg-[#050505]/95 backdrop-blur-2xl" />
              <motion.div layoutId="artifact-card" className="relative w-full max-w-6xl bg-[#050505] border border-stone-800 p-12 shadow-2xl overflow-hidden flex flex-col gap-12">
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: currentAccent }} />
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3"><Layers size={14} style={{ color: currentAccent }} /><span className="mono-font text-[10px] text-stone-500 uppercase tracking-[0.4em]">Schematic_View / {activeLens.toUpperCase()}</span></div>
                    <h3 className="serif-font text-4xl text-white italic">{project.lenses[activeLens as LensId].artifact}</h3>
                  </div>
                  <button onClick={() => setExpandedArtifact(false)} className="text-stone-600 hover:text-white transition-all"><X size={32} /></button>
                </div>
                <div className="flex-1 aspect-video bg-stone-900 border border-stone-800 relative group overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://placehold.co/1200x800/1a1a1a/FFF?text=SYSTEM_BLUEPRINT_V4')] bg-cover bg-center grayscale mix-blend-overlay" />
                  <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,4px_100%]" />
                  <div className="flex flex-col items-center gap-6 relative z-10">
                    <div className="w-24 h-24 rounded-full border border-stone-800 flex items-center justify-center animate-spin-slow"><Crosshair className="text-stone-700" size={40} strokeWidth={0.5} /></div>
                    <p className="mono-font text-[10px] text-stone-600 uppercase tracking-[0.5em] animate-pulse">Scanning_Active_Telemetry_Node...</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] mono-font text-stone-700 uppercase tracking-widest">
                  <span className="flex items-center gap-4"><Scan size={14} /> Ref_0x91F_DATA_STREAM</span>
                  <span className="flex items-center gap-4"><Database size={14} /> Provenance_Verified</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showInputModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isGenerating && setShowInputModal(false)} className="absolute inset-0 bg-stone-950/90 backdrop-blur-xl" />
              <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="relative w-full max-w-5xl bg-stone-900 p-12 shadow-2xl border border-stone-800">
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-6"><Sparkles className="w-8 h-8" style={{ color: currentAccent }} /><h2 className="serif-font text-4xl italic text-white">Ingestion_Pipeline</h2></div>
                  <button onClick={() => setShowInputModal(false)} className="text-stone-600 hover:text-white transition-all"><X size={32} /></button>
                </div>
                <textarea value={rawText} onChange={(e) => setRawText(e.target.value)} placeholder="Provide raw case study metadata..." className="w-full h-80 p-8 bg-stone-950 border border-stone-800 text-stone-200 outline-none resize-none serif-font text-2xl font-light mb-12" />
                <div className="flex justify-between items-center">
                  <p className="mono-font text-[10px] text-stone-600 uppercase tracking-widest max-w-md leading-relaxed">System will architect three contextual lenses using probabilistic semantic reconstruction.</p>
                  <button disabled={isGenerating || !rawText.trim()} onClick={handleGenerate} className={`px-12 py-4 mono-font text-xs font-black uppercase tracking-[0.4em] transition-all ${isGenerating || !rawText.trim() ? 'bg-stone-800 text-stone-700 cursor-not-allowed' : 'bg-white text-black hover:bg-stone-200'}`}>
                    {isGenerating ? <Loader2 className="animate-spin" /> : 'Execute_Build'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <footer className="px-12 py-20 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] mono-font text-stone-800 uppercase tracking-[0.6em] font-black border-t border-white/5 relative z-50 bg-[#050505]">
          <p>© ASJH CONTEXT ENGINE // SPACE & COLOR 2024</p>
          <div className="flex gap-20 text-stone-400">
            <span className="hover:text-stone-200 cursor-pointer transition-colors border-b border-transparent hover:border-stone-700 pb-1">Architectural_Manifesto</span>
          </div>
        </footer>

        <style>{` @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin-slow { animation: spin-slow 12s linear infinite; } `}</style>
      </div>
    </LayoutGroup>
  );
}