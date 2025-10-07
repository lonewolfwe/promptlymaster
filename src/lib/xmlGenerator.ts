export type IntentType = 
  | "summarization"
  | "question_answer"
  | "translation"
  | "creative_writing"
  | "code_generation"
  | "analysis"
  | "general";

export interface IntentDetectionResult {
  intent: IntentType;
  confidence: number;
  matchedKeywords: string[];
  alternativeIntents: Array<{ intent: IntentType; confidence: number }>;
}

export interface XMLTemplate {
  intent: IntentType;
  xml: string;
  explanation: string;
}

export function detectIntent(plainText: string): IntentDetectionResult {
  const lowerText = plainText.toLowerCase();
  const scores: Record<IntentType, { score: number; keywords: string[] }> = {
    summarization: { score: 0, keywords: [] },
    question_answer: { score: 0, keywords: [] },
    translation: { score: 0, keywords: [] },
    creative_writing: { score: 0, keywords: [] },
    code_generation: { score: 0, keywords: [] },
    analysis: { score: 0, keywords: [] },
    general: { score: 0, keywords: [] }
  };

  // Summarization patterns
  const summarizationPatterns = [
    { pattern: /\b(summarize|summary|tldr|brief)\b/i, weight: 3, keyword: "summarize" },
    { pattern: /\b(key points|main ideas|gist)\b/i, weight: 2, keyword: "key points" },
    { pattern: /\b(condense|shorten)\b/i, weight: 2, keyword: "condense" }
  ];

  // Translation patterns
  const translationPatterns = [
    { pattern: /\b(translate|translation)\b/i, weight: 3, keyword: "translate" },
    { pattern: /from \w+ to \w+/i, weight: 3, keyword: "language pair" },
    { pattern: /\b(spanish|french|german|chinese|japanese|italian)\b/i, weight: 1, keyword: "language" }
  ];

  // Creative writing patterns
  const creativePatterns = [
    { pattern: /\b(write|create|compose)\b/i, weight: 2, keyword: "write" },
    { pattern: /\b(story|poem|essay|article|blog)\b/i, weight: 3, keyword: "creative content" },
    { pattern: /\b(creative|imaginative|original)\b/i, weight: 2, keyword: "creative" }
  ];

  // Code generation patterns
  const codePatterns = [
    { pattern: /\b(code|function|program|script)\b/i, weight: 3, keyword: "code" },
    { pattern: /\b(implement|develop|build)\b/i, weight: 1, keyword: "implement" },
    { pattern: /\b(python|javascript|java|c\+\+|react|algorithm)\b/i, weight: 2, keyword: "programming language" }
  ];

  // Analysis patterns
  const analysisPatterns = [
    { pattern: /\b(analyze|analysis|evaluate)\b/i, weight: 3, keyword: "analyze" },
    { pattern: /\b(compare|contrast|assess)\b/i, weight: 2, keyword: "compare" },
    { pattern: /\b(pros and cons|advantages|disadvantages)\b/i, weight: 2, keyword: "pros/cons" }
  ];

  // Question patterns
  const questionPatterns = [
    { pattern: /\?/g, weight: 2, keyword: "question mark" },
    { pattern: /\b(what|how|why|when|where|who|which)\b/i, weight: 1, keyword: "question word" },
    { pattern: /\b(explain|tell me|can you)\b/i, weight: 1, keyword: "inquiry" }
  ];

  // Score each intent
  [
    { patterns: summarizationPatterns, intent: "summarization" as IntentType },
    { patterns: translationPatterns, intent: "translation" as IntentType },
    { patterns: creativePatterns, intent: "creative_writing" as IntentType },
    { patterns: codePatterns, intent: "code_generation" as IntentType },
    { patterns: analysisPatterns, intent: "analysis" as IntentType },
    { patterns: questionPatterns, intent: "question_answer" as IntentType }
  ].forEach(({ patterns, intent }) => {
    patterns.forEach(({ pattern, weight, keyword }) => {
      const matches = lowerText.match(pattern);
      if (matches) {
        scores[intent].score += weight * matches.length;
        if (!scores[intent].keywords.includes(keyword)) {
          scores[intent].keywords.push(keyword);
        }
      }
    });
  });

  // Find top intent and alternatives
  const sortedIntents = Object.entries(scores)
    .map(([intent, data]) => ({
      intent: intent as IntentType,
      score: data.score,
      keywords: data.keywords
    }))
    .sort((a, b) => b.score - a.score);

  const topIntent = sortedIntents[0];
  
  // If no strong match, default to general
  if (topIntent.score === 0) {
    return {
      intent: "general",
      confidence: 0.5,
      matchedKeywords: [],
      alternativeIntents: []
    };
  }

  // Calculate confidence (0-1 scale)
  const totalScore = sortedIntents.reduce((sum, item) => sum + item.score, 0);
  const confidence = Math.min(topIntent.score / (totalScore || 1), 0.99);

  // Get alternative intents with >10% of top score
  const alternatives = sortedIntents
    .slice(1, 4)
    .filter(item => item.score > topIntent.score * 0.1)
    .map(item => ({
      intent: item.intent,
      confidence: Math.min(item.score / (totalScore || 1), 0.99)
    }));

  return {
    intent: topIntent.intent,
    confidence,
    matchedKeywords: topIntent.keywords,
    alternativeIntents: alternatives
  };
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

export function getIntentIcon(intent: IntentType): string {
  const icons: Record<IntentType, string> = {
    summarization: "📝",
    question_answer: "❓",
    translation: "🌐",
    creative_writing: "✨",
    code_generation: "💻",
    analysis: "📊",
    general: "🎯"
  };
  return icons[intent];
}

export function getIntentColor(intent: IntentType): string {
  const colors: Record<IntentType, string> = {
    summarization: "from-blue-500 to-cyan-500",
    question_answer: "from-purple-500 to-pink-500",
    translation: "from-green-500 to-emerald-500",
    creative_writing: "from-yellow-500 to-orange-500",
    code_generation: "from-indigo-500 to-blue-500",
    analysis: "from-red-500 to-rose-500",
    general: "from-gray-500 to-slate-500"
  };
  return colors[intent];
}