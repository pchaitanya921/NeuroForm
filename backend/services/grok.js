const axios = require('axios');

const GROK_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROK_MODEL = 'llama-3.3-70b-versatile';

const callGrok = async (systemPrompt, userMessage) => {
  const apiKey = process.env.GROK_API_KEY;
  console.log('[Groq] Using model:', GROK_MODEL, '| Key prefix:', apiKey?.slice(0, 10) + '...');

  const response = await axios.post(
    GROK_API_URL,
    {
      model: GROK_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 1500
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data.choices[0].message.content;
};

// Strip markdown code fences that LLMs sometimes wrap JSON in
const cleanJSON = (raw) => {
  return raw
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
};


/**
 * Generate a full form from a user's goal
 */
const generateForm = async (goal) => {
  const systemPrompt = `You are an expert form architect and UX researcher. 
Your task is to design intelligent, comprehensive survey forms that maximize insight collection.
Always respond with valid JSON only. No markdown, no explanation, just the JSON object.`;

  const userMessage = `Design a complete survey form for this goal: "${goal}"

Return a JSON object with this exact structure:
{
  "title": "Form title",
  "description": "Brief description of what this form collects",
  "questions": [
    {
      "id": "q1",
      "type": "text|textarea|rating|mcq|scale|yes_no|email|number",
      "question": "The question text",
      "placeholder": "Optional placeholder text",
      "options": ["Option A", "Option B"],
      "required": true,
      "minRating": 1,
      "maxRating": 5,
      "conditionalLogic": {
        "enabled": false,
        "triggerQuestionId": "",
        "triggerCondition": "",
        "action": "show"
      }
    }
  ]
}

Rules:
- ALWAYS include a "Full Name" (type: text) and "Email Address" (type: email) question at the beginning of the form. These must be required.
- Create 6-10 thoughtful questions in total, including the contact details.
- Mix question types appropriately (use rating for satisfaction, mcq for choices, textarea for open-ended)
- Add adaptive conditional logic: if there's a rating question, add follow-up questions for low ratings (lte:3) with conditionalLogic.enabled=true
- Use conditional trigger condition format: "lte:3" means rating <= 3, "gte:4" means >= 4, "eq:yes" means equals yes
- Order questions from general to specific
- Make questions professional and insightful`;

  const raw = await callGrok(systemPrompt, userMessage);
  return JSON.parse(cleanJSON(raw));
};

/**
 * Determine the next adaptive question based on current answers
 */
const getAdaptiveNext = async (questions, answers, currentQuestionId) => {
  const systemPrompt = `You are an adaptive survey AI. Analyze the current answers and determine the next best question.
Respond with valid JSON only.`;

  const userMessage = `Given these survey questions: ${JSON.stringify(questions)}
And these current answers: ${JSON.stringify(answers)}
The user just answered question ID: ${currentQuestionId}

Should we show additional follow-up questions? Return:
{
  "shouldAddFollowUp": true/false,
  "followUpQuestion": {
    "id": "adaptive_1",
    "type": "textarea",
    "question": "Follow-up question text",
    "required": false,
    "conditionalLogic": { "enabled": false }
  },
  "reason": "Brief reason"
}`;

  const raw = await callGrok(systemPrompt, userMessage);
  return JSON.parse(cleanJSON(raw));
};

/**
 * Generate AI insights from all form responses
 */
const generateInsights = async (form, responses) => {
  const systemPrompt = `You are a business intelligence analyst specialized in survey data. 
Analyze survey responses and extract actionable insights. Respond with valid JSON only.`;

  // Prepare aggregated response data
  const responseData = responses.map(r => ({
    answers: r.answers.map(a => ({ question: a.questionText, answer: a.answer }))
  }));

  const userMessage = `Analyze these ${responses.length} survey responses for the form titled "${form.title}".
Goal of the form: "${form.goal || 'General feedback collection'}"

Response data:
${JSON.stringify(responseData, null, 2)}

Return a JSON object:
{
  "sentimentScore": 0.5,
  "sentimentLabel": "positive|neutral|negative",
  "keyThemes": ["theme1", "theme2", "theme3"],
  "painPoints": ["pain point 1", "pain point 2"],
  "positiveHighlights": ["highlight 1", "highlight 2"],
  "actionableRecommendations": ["action 1", "action 2", "action 3"],
  "executiveSummary": "A 2-3 sentence executive summary with specific metrics and business impact",
  "questionInsights": [
    {
      "questionId": "q1",
      "questionText": "Question text",
      "topAnswers": ["most common answer 1", "top answer 2"],
      "insight": "One sentence insight about this question's data"
    }
  ]
}

Be specific, data-driven, and actionable. Mention percentages where relevant.`;

  const raw = await callGrok(systemPrompt, userMessage);
  return JSON.parse(cleanJSON(raw));
};

/**
 * Generate an executive summary (short, shareable)
 */
const generateExecutiveSummary = async (form, insight) => {
  const systemPrompt = `You are a business communication expert. Write clear, compelling executive summaries.`;

  const userMessage = `Write an investor-ready executive summary for this survey:
Form: "${form.title}"
Total Responses: ${insight.totalResponses}
Sentiment: ${insight.sentimentLabel} (${insight.sentimentScore})
Key Themes: ${insight.keyThemes?.join(', ')}
Pain Points: ${insight.painPoints?.join(', ')}
Recommendations: ${insight.actionableRecommendations?.join(', ')}

Write a 4-5 sentence executive summary that:
1. States the key finding with a data point
2. Highlights the top user pain point
3. Notes positive aspects
4. Ends with the top priority action recommendation

Return just the summary text, no JSON, no formatting.`;

  return await callGrok(systemPrompt, userMessage);
};

/**
 * Chat with form data
 */
const chatWithData = async (query, insights, forms) => {
  const systemPrompt = `You are NeuroForm AI, an intelligent data analyst assistant. Answer the user's question about their forms based ONLY on the provided data context.
  
Be concise, direct, helpful, and professional. Do not use complex markdown unles it helps readability (e.g., bullet points).`;

  const userMessage = `My Global Form Context: 
Active Form Titles: ${JSON.stringify(forms.map(f => f.title))}
Aggregated Insights Summary: ${JSON.stringify(insights.map(i => i.executiveSummary))}
Identified Key Themes: ${JSON.stringify(insights.flatMap(i => i.keyThemes))}
User Pain Points: ${JSON.stringify(insights.flatMap(i => i.painPoints))}

User Question: "${query}"

Answer the question directly based on the data above. If the data isn't there, say you don't have enough data yet.`;

  return await callGrok(systemPrompt, userMessage);
};

module.exports = { generateForm, getAdaptiveNext, generateInsights, generateExecutiveSummary, chatWithData };
