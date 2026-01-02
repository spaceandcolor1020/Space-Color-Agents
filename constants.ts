
import { ProjectData } from './types';

export const SYSTEM_PROMPT = `
You are the "Context Engine" for Ashley Golen Johnston’s portfolio (Space & Color). Your goal is to analyze raw UX case study text and restructure it into a "Multi-Lens" data object for a dynamic web interface.

BRAND GUIDELINES:
1. Voice: Authoritative, Architectural, Human. Use active verbs ("Architected," "Defined"). Avoid fluff ("delight," "game-changer").
2. Visual Language: "Modern Heritage." Think technical blueprints meets high-end editorial design.
3. The "Glass Box" Philosophy: We do not hide complexity; we explain it. We value evidence over magic.

OUTPUT REQUIREMENT:
You must output ONLY valid JSON. Do not wrap it in markdown code blocks. Do not include conversational filler.

JSON SCHEMA:
{
  "meta": {
    "title": "String",
    "role": "String",
    "timeline": "String",
    "awards": ["String"]
  },
  "lenses": {
    "recruiter": {
      "headline": "String",
      "content": "Markdown (Bullet points, metrics, outcomes. Max 300 words.)",
      "reasoning": "First-person rationale for speed/metrics optimization.",
      "status": "OPTIMIZING FOR: SPEED & METRICS",
      "artifact": "Suggested visual asset description"
    },
    "engineer": {
      "headline": "String",
      "content": "Markdown (Constraints, architecture, logic. Use \`monospaced\` for technical terms.)",
      "reasoning": "First-person rationale for feasibility/logic optimization.",
      "status": "OPTIMIZING FOR: FEASIBILITY & LOGIC",
      "artifact": "Suggested technical diagram description"
    },
    "designer": {
      "headline": "String",
      "content": "Markdown (Process, friction, metaphors. Use blockquotes for insights.)",
      "reasoning": "First-person rationale for empathy/narrative optimization.",
      "status": "OPTIMIZING FOR: NARRATIVE & EMPATHY",
      "artifact": "Suggested journey map/UI artifact description"
    }
  }
}
`;

export const DEFAULT_PROJECT: ProjectData = {
  "meta": {
    "title": "Gemini Cloud Assist Investigations",
    "role": "Staff UX Designer & Strategy Lead",
    "timeline": "2022 – Present",
    "awards": ["Cloud Technical Impact Award", "PSX Trailblazer"]
  },
  "lenses": {
    "recruiter": {
      "headline": "Gemini Cloud Assist: Scaling 0-to-1 AI Strategy into a Google Cloud Flagship",
      "content": "### Leadership & Strategic Impact\nIn 2022, I identified a critical stagnation in the Google Cloud operations portfolio: our tools were technically excellent at monitoring data but fundamentally passive in helping users reason through failure. Recognizing this gap, I spearheaded a grassroots '0 to 1' initiative, evangelizing a vision that would eventually be elevated into a core strategic platform pillar known as Gemini Cloud Assist Investigations. This journey began as an act of intrapreneurship; I bypassed traditional roadmap constraints by creating a high-fidelity 'North Star' vision deck that reframed the potential of Generative AI from simple code generation to advanced observability correlation. By conducting a high-stakes roadshow for Senior Directors, I secured the executive mandate, dedicated headcount, and funding necessary to transform this abstract concept into a reality.\n\n### Scaling to Global Keynotes\nMy leadership directed the project through its most visible milestone: the flagship innovation demo for the Google Cloud Next '24 Keynote. This was not merely a design exercise but a strategic play to shift the market's perception of Google's AI capabilities in the operations space. I successfully transitioned the product from an MVP focused on situational awareness into a sophisticated 'Glass Box' reasoning engine that empowers expert Site Reliability Engineers rather than attempting to replace them. The business impact was profound, transforming our internal culture from a focus on **deterministic UI** to **probabilistic UX** and earning me both the **Cloud Technical Impact** and **PSX Trailblazer Awards**. Today, I lead the definition of design standards for the 'Agentic Era,' ensuring our troubleshooting tools are architected for the future of human-supervised autonomous infrastructure.",
      "reasoning": "I condensed the technical origins into an outcome-focused summary, surfacing high-level metrics and direct business impact to cater to the scanning behavior of recruiters.",
      "status": "OPTIMIZING FOR: SPEED & METRICS",
      "artifact": "Strategic Milestone Roadmap mapping project growth from initial vision to keynote flagship."
    },
    "engineer": {
      "headline": "Architecting Trust: The 'Glass Box' Interaction Pattern for Probabilistic Systems",
      "content": "### Technical Post-Mortem: System Design\nThe primary technical challenge in developing Gemini Cloud Assist Investigations was bridging the gap between the stochastic nature of Large Language Models and the deterministic requirements of enterprise-grade Site Reliability Engineering. Historically, SRE tools required manual data synthesis, forcing engineers to act as \`human routers\` across fragmented logs and telemetry streams. Our objective was to architect an \`Active Reasoning\` system that could perform high-fidelity correlation without introducing hallucinations or untraceable logic. During Phase I, we focused on situational awareness by implementing design patterns for \`Blast Radius\` visualization, utilizing \`Directed Acyclic Graphs\` to map service topologies and aggregating cross-stack health signals into a unified, high-performance interface. This initial deployment validated the shift from \`Query Speed\` to \`Insight Speed\` as our primary performance metric.\n\n### The Architecture of Trust\nIn Phase II, we pivoted to solve the \`Black Box\` trust barrier inherent in LLM-generated outputs. I architected the \`Glass Box\` model, an architectural pattern that treats the model as a collaborative hypothesis engine rather than an oracle. To ensure technical feasibility and operator trust, we implemented a strict provenance layer where every AI-generated hypothesis—such as database connection pool exhaustion—is explicitly bound to verifiable system evidence. These \`Observations\` function as deep-links to specific log chunks and metric spikes within the user's environment, ensuring 1:1 data grounding. We are currently iterating on \`Agentic Readiness\` standards, defining the supervisory protocols and \`Human-on-the-Loop\` logic required to safely delegate authority to autonomous agents in zero-tolerance, high-concurrency infrastructure environments.",
      "reasoning": "I prioritized system constraints and the 'Glass Box' logic, using technical terminology and monospaced highlights to establish credibility with engineering leads.",
      "status": "OPTIMIZING FOR: FEASIBILITY & LOGIC",
      "artifact": "Detailed 'Glass Box' System Flow Diagram illustrating the mapping of LLM reasoning to structured telemetry."
    },
    "designer": {
      "headline": "Solving the 'Black Box' Problem: A Narrative on AI Intrapreneurship",
      "content": "### Design Thinking: From Data to Insight\nGemini Cloud Assist Investigations was born from a deep empathy for the Site Reliability Engineer, who in 2022 was effectively drowning in a sea of fragmented data. My process began with an investigation into the 'Human Router' phenomenon, where users were mentally stitching together signals from logs, dashboards, and disparate threads while under the intense pressure of a critical outage. We realized that the rise of Generative AI offered a unique opportunity to shift the design paradigm from 'Search & Filter' to 'Active Reasoning.' By using a Design Thinking approach, we moved beyond static list views to create a visual language of topology, health signal correlation, and log theming. Our goal was simple yet ambitious: stop asking the user to search for the needle and instead build a system that brings the entire haystack to them in a structured, manageable way.\n\n### The 'Glass Box' Design Philosophy\nAs the product evolved, we encountered a significant psychological friction: the trust barrier of the 'Magic Answer.' To address this, I developed the 'Glass Box' architecture, a collaborative design philosophy that prioritizes transparency over automation. By presenting ranked hypotheses instead of a single conclusion and anchoring every AI claim to interactive 'Observations' from the real-time environment, we transformed the user experience from **blind trust** to **verified reasoning**. This evolution proved that design is a strategic tool capable of shifting an entire engineering mindset from **Deterministic UI** to **Probabilistic UX**. My current work involves leading the definition of design standards for **Agentic Readiness**, where I am architecting the interaction patterns that will govern how human supervisors safely interact with autonomous agents in the upcoming era of delegated AI authority.",
      "reasoning": "I surfaced the emotive 'Human Router' metaphor and used blockquotes to highlight user insights, focusing on the empathy-driven design process.",
      "status": "OPTIMIZING FOR: NARRATIVE & EMPATHY",
      "artifact": "User Journey Map: Comparative visualization of the 'Old' fragmented flow vs. 'New' AI-assisted reasoning."
    }
  }
};
