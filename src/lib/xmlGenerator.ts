export type IntentType = 
  | "summarization"
  | "question_answer"
  | "translation"
  | "creative_writing"
  | "code_generation"
  | "analysis"
  | "general";

export interface XMLTemplate {
  intent: IntentType;
  xml: string;
  explanation: string;
}

export function detectIntent(plainText: string): IntentType {
  const lowerText = plainText.toLowerCase();
  
  if (lowerText.includes("summarize") || lowerText.includes("summary") || lowerText.includes("tldr")) {
    return "summarization";
  }
  
  if (lowerText.includes("translate") || lowerText.includes("translation") || lowerText.match(/from \w+ to \w+/)) {
    return "translation";
  }
  
  if (lowerText.includes("write") || lowerText.includes("story") || lowerText.includes("poem") || lowerText.includes("creative")) {
    return "creative_writing";
  }
  
  if (lowerText.includes("code") || lowerText.includes("function") || lowerText.includes("program") || lowerText.includes("script")) {
    return "code_generation";
  }
  
  if (lowerText.includes("analyze") || lowerText.includes("analysis") || lowerText.includes("compare") || lowerText.includes("evaluate")) {
    return "analysis";
  }
  
  if (lowerText.includes("?") || lowerText.includes("what") || lowerText.includes("how") || lowerText.includes("why") || lowerText.includes("when")) {
    return "question_answer";
  }
  
  return "general";
}

export function generateXML(plainText: string, intent: IntentType): XMLTemplate {
  const templates: Record<IntentType, XMLTemplate> = {
    summarization: {
      intent: "summarization",
      xml: `<task>
  <instruction>Summarize the following text</instruction>
  <context>
    <text>${escapeXml(plainText)}</text>
  </context>
  <requirements>
    <length>concise</length>
    <focus>key_points</focus>
  </requirements>
</task>`,
      explanation: "This XML structure organizes a summarization task with clear instruction, context containing the text to summarize, and specific requirements for the output format."
    },
    
    question_answer: {
      intent: "question_answer",
      xml: `<query>
  <question>${escapeXml(plainText)}</question>
  <response_format>
    <type>detailed</type>
    <include_examples>true</include_examples>
  </response_format>
</query>`,
      explanation: "This XML formats a question-answer task, specifying the question and desired response characteristics like detail level and example inclusion."
    },
    
    translation: {
      intent: "translation",
      xml: `<translation>
  <source_text>${escapeXml(plainText)}</source_text>
  <parameters>
    <preserve_tone>true</preserve_tone>
    <formality>neutral</formality>
  </parameters>
</translation>`,
      explanation: "This XML structures a translation request with the source text and parameters to control tone preservation and formality level."
    },
    
    creative_writing: {
      intent: "creative_writing",
      xml: `<creative_task>
  <instruction>${escapeXml(plainText)}</instruction>
  <style>
    <tone>engaging</tone>
    <creativity_level>high</creativity_level>
  </style>
  <constraints>
    <originality>required</originality>
  </constraints>
</creative_task>`,
      explanation: "This XML organizes a creative writing task with instructions, style preferences, and constraints to guide the AI's creative output."
    },
    
    code_generation: {
      intent: "code_generation",
      xml: `<coding_task>
  <instruction>${escapeXml(plainText)}</instruction>
  <requirements>
    <include_comments>true</include_comments>
    <best_practices>true</best_practices>
  </requirements>
  <output>
    <format>complete_code</format>
  </output>
</coding_task>`,
      explanation: "This XML structures a code generation request with clear instructions, coding requirements like comments and best practices, and output format specifications."
    },
    
    analysis: {
      intent: "analysis",
      xml: `<analysis_task>
  <subject>${escapeXml(plainText)}</subject>
  <approach>
    <depth>comprehensive</depth>
    <include_pros_cons>true</include_pros_cons>
  </approach>
  <output>
    <structure>organized</structure>
    <evidence_based>true</evidence_based>
  </output>
</analysis_task>`,
      explanation: "This XML formats an analysis task with the subject to analyze, approach parameters like depth and balance, and output requirements for organization and evidence."
    },
    
    general: {
      intent: "general",
      xml: `<task>
  <instruction>${escapeXml(plainText)}</instruction>
  <parameters>
    <clarity>high</clarity>
    <detail_level>appropriate</detail_level>
  </parameters>
</task>`,
      explanation: "This general XML template structures any task with clear instructions and basic parameters for clarity and detail level."
    }
  };
  
  return templates[intent];
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function getIntentDisplayName(intent: IntentType): string {
  const names: Record<IntentType, string> = {
    summarization: "Summarization",
    question_answer: "Question & Answer",
    translation: "Translation",
    creative_writing: "Creative Writing",
    code_generation: "Code Generation",
    analysis: "Analysis",
    general: "General Task"
  };
  return names[intent];
}
