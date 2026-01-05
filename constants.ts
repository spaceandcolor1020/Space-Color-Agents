
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
      "status": "CURATION: EXECUTIVE_SUMMARY",
      "artifact": "Suggested visual asset description"
    },
    "engineer": {
      "headline": "String",
      "content": "Markdown (Constraints, architecture, logic. Use \`monospaced\` for technical terms.)",
      "reasoning": "First-person rationale for feasibility/logic optimization.",
      "status": "CURATION: TECHNICAL_DEEP_DIVE",
      "artifact": "Suggested technical diagram description"
    },
    "designer": {
      "headline": "String",
      "content": "Markdown (Process, friction, metaphors. Use blockquotes for insights.)",
      "reasoning": "First-person rationale for empathy/narrative optimization.",
      "status": "CURATION: PROCESS_NARRATIVE",
      "artifact": "Suggested journey map/UI artifact description"
    },
    "source": {
      "headline": "String",
      "content": "Markdown (Full raw record, high detail, chronological.)",
      "reasoning": "Retrieving full archival record. No context filters applied.",
      "status": "MODE: ARCHIVE_READ_ONLY"
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
      "content": "### Leadership & Strategic Impact\nIn 2022, I identified a critical stagnation in the Google Cloud operations portfolio: our tools were technically excellent at monitoring data but fundamentally passive in helping users reason through failure.\n\n![Keynote Presentation Context](keynote-stage.jpg)\n\nRecognizing this gap, I spearheaded a grassroots '0 to 1' initiative, evangelizing a vision that would eventually be elevated into a core strategic platform pillar known as Gemini Cloud Assist Investigations.\n\n### Scaling to Global Keynotes\nMy leadership directed the project through its most visible milestone: the flagship innovation demo for the Google Cloud Next '24 Keynote. I successfully transitioned the product from an MVP focused on situational awareness into a sophisticated 'Glass Box' reasoning engine that empowers expert Site Reliability Engineers.\n\n![Business Impact & Growth Metrics](impact-metrics.jpg)\n\n### Business Impact\nThe business impact was profound, transforming our internal culture from a focus on **deterministic UI** to **probabilistic UX** and earning me both the **Cloud Technical Impact** and **PSX Trailblazer Awards**.",
      "reasoning": "I condensed the technical origins into an outcome-focused summary, surfacing high-level metrics and direct business impact to cater to the scanning behavior of recruiters.",
      "status": "CURATION: EXECUTIVE_SUMMARY",
      "artifact": "Strategic Milestone Roadmap mapping project growth from initial vision to keynote flagship."
    },
    "engineer": {
      "headline": "Architecting Trust: The 'Glass Box' Interaction Pattern for Probabilistic Systems",
      "content": "### Technical Post-Mortem: System Design\nThe primary technical challenge in developing Gemini Cloud Assist Investigations was bridging the gap between the stochastic nature of Large Language Models and the deterministic requirements of enterprise-grade Site Reliability Engineering.\n\n![Glass Box System Architecture](glass-box-architecture.jpg)\n\nHistorically, SRE tools required manual data synthesis, forcing engineers to act as \`human routers\` across fragmented logs and telemetry streams.\n\n### Architecture of Trust\nIn Phase II, we pivoted to solve the \`Black Box\` trust barrier inherent in LLM-generated outputs. I architected the \`Glass Box\` model, an architectural pattern that treats the model as a collaborative hypothesis engine rather than an oracle.\n\n![Latency & Provenance Flow Diagram](system-latency-flow.jpg)\n\nTo ensure technical feasibility and operator trust, we implemented a strict provenance layer where every AI-generated hypothesis is explicitly bound to verifiable system evidence. These \`Observations\` function as deep-links to specific log chunks and metric spikes within the user's environment.",
      "reasoning": "I prioritized system constraints and the 'Glass Box' logic, using technical terminology and monospaced highlights to establish credibility with engineering leads.",
      "status": "CURATION: TECHNICAL_DEEP_DIVE",
      "artifact": "Detailed 'Glass Box' System Flow Diagram illustrating the mapping of LLM reasoning to structured telemetry."
    },
    "designer": {
      "headline": "Solving the 'Black Box' Problem: A Narrative on AI Intrapreneurship",
      "content": "### Design Thinking: From Data to Insight\nGemini Cloud Assist Investigations was born from a deep empathy for the Site Reliability Engineer. My process began with an investigation into the 'Human Router' phenomenon, where users were mentally stitching together signals from logs and dashboards while under intense pressure.\n\n![The 'Human Router' Problem Sketch](human-router-sketch.jpg)\n\nWe realized that the rise of Generative AI offered a unique opportunity to shift the design paradigm from 'Search & Filter' to 'Active Reasoning.' By using a Design Thinking approach, we moved beyond static list views to create a visual language of topology, health signal correlation, and log theming.\n\n### Glass Box Design Philosophy\nAs the product evolved, we addressed the trust barrier of the 'Magic Answer' by developing the 'Glass Box' architecture, a collaborative design philosophy that prioritizes transparency over automation.\n\n![Final UI Evolution & Composition](ui-evolution-comp.jpg)\n\nBy presenting ranked hypotheses and anchoring every AI claim to interactive 'Observations', we transformed the experience from **blind trust** to **verified reasoning**. This evolution proved that design is a strategic tool capable of shifting an entire engineering mindset.",
      "reasoning": "I surfaced the emotive 'Human Router' metaphor and used blockquotes to highlight user insights, focusing on the empathy-driven design process.",
      "status": "CURATION: PROCESS_NARRATIVE",
      "artifact": "User Journey Map: Comparative visualization of the 'Old' fragmented flow vs. 'New' AI-assisted reasoning."
    },
    "source": {
      "headline": "The Original Investigation (Raw Record)",
      "content": "### Archival Summary\nThis document represents the unmodified, chronological project log for Gemini Cloud Assist Investigations.\n\n### Initial Hypothesis (Q1 2022)\nThe project was conceptualized to address the growing complexity of hybrid-cloud observability. Early user research indicated that SREs were overwhelmed by a 400% increase in telemetry volume over a 24-month period.\n\n### Prototype Development\nInitial prototypes focused on graph-based topology views. We utilized D3.js for visual rendering and explored early integration with Google's internal LLM infrastructure for natural language log summarization.",
      "reasoning": "Retrieving full archival record. No context filters applied. Displaying raw data for comprehensive audit.",
      "status": "MODE: ARCHIVE_READ_ONLY"
    }
  }
};
