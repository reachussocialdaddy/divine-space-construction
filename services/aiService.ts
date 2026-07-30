import OpenAI from 'openai';

/**
 * Helper to ensure the AI client is initialized with a valid key.
 * Supports NVIDIA NIM, Gemini, and OpenAI APIs natively.
 */
export const getAIClient = (): { client: OpenAI; model: string } => {
  const geminiApiKey = (process.env && process.env.GEMINI_API_KEY) || 
                       (import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) || '';
  
  const openaiApiKey = (process.env && process.env.OPENAI_API_KEY) || 
                       (import.meta.env && import.meta.env.VITE_OPENAI_API_KEY) || '';

  const nvidiaApiKey = (process.env && process.env.NVIDIA_API_KEY) || 
                       (import.meta.env && import.meta.env.VITE_NVIDIA_API_KEY) || '';

  // Detect which key is actually the NVIDIA NIM key (starts with nvapi-)
  const finalNvidiaKey = [nvidiaApiKey, geminiApiKey, openaiApiKey].find(k => k.startsWith('nvapi-'));

  // 1. Prefer NVIDIA NIM if NVIDIA key is present
  if (finalNvidiaKey) {
    const isBrowser = typeof window !== 'undefined';
    const baseUrl = isBrowser ? `${window.location.origin}/api/nvidia` : '/api/nvidia';
    console.log("AI Client: Initializing NVIDIA NIM Client (Proxied) - Key starts with:", finalNvidiaKey.substring(0, 8) + "...");
    return {
      client: new OpenAI({
        apiKey: finalNvidiaKey,
        baseURL: baseUrl,
        dangerouslyAllowBrowser: true
      }),
      model: "meta/llama-3.2-11b-vision-instruct"
    };
  }

  // 2. Prefer Gemini if GEMINI_API_KEY is present
  if (geminiApiKey && geminiApiKey !== "undefined" && geminiApiKey !== "null" && geminiApiKey !== "") {
    console.log("AI Client: Initializing Gemini Client - Key starts with:", geminiApiKey.substring(0, 4) + "...");
    return {
      client: new OpenAI({
        apiKey: geminiApiKey,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
        dangerouslyAllowBrowser: true
      }),
      model: "gemini-2.5-flash"
    };
  }

  // 3. Fallback to OpenAI if OPENAI_API_KEY is present
  if (openaiApiKey && openaiApiKey !== "undefined" && openaiApiKey !== "null" && openaiApiKey !== "") {
    console.log("AI Client: Initializing OpenAI Client - Key starts with:", openaiApiKey.substring(0, 4) + "...");
    if (!openaiApiKey.startsWith('sk-')) {
      console.warn("WARNING: The detected OPENAI_API_KEY does not appear to be a valid OpenAI API key (expected to start with 'sk-').");
    }
    return {
      client: new OpenAI({
        apiKey: openaiApiKey,
        dangerouslyAllowBrowser: true
      }),
      model: "gpt-4o"
    };
  }

  console.error("CRITICAL: No valid API Key (NVIDIA, Gemini, or OpenAI) is configured in the environment.");
  throw new Error("MISSING_API_KEY: No API key found. Please add GEMINI_API_KEY or NVIDIA_API_KEY to your .env file to run locally.");
};

/**
 * Service to interact with AI for lead assistance.
 */
export const getAIResponse = async (prompt: string, history: { role: 'user' | 'assistant', content: string }[]) => {
  try {
    const { client: ai, model } = getAIClient();
    
    // Choose appropriate chat model based on provider
    let chatModel = 'gpt-4o-mini';
    if (model.includes('gemini')) {
      chatModel = 'gemini-2.5-flash';
    } else if (model.includes('llama')) {
      chatModel = 'meta/llama-3-70b-instruct'; // Chat fallback for NVIDIA NIM
    }
    
    const messages: any[] = [
      {
        role: "system",
        content: `You are the Lead Architect for Divine Space Construction. 
        Your goal is to have a natural, human-like conversation with potential clients, similar to how a professional consultant would talk in person.
        
        CONVERSATION GUIDELINES:
        1. BE CONCISE: Never send long paragraphs. Keep your replies short and easy to read.
        2. BE HUMAN: Use a warm, professional, and helpful tone. Avoid sounding like a rigid bot.
        3. UNDERSTAND REQUIREMENTS: Start by understanding what the user needs. Ask one question at a time to keep the conversation flowing.
        4. SERVICES: We specialize in luxury home renovations, basement finishing, kitchen remodeling, and custom home builds in the GTA.
        5. CALL TO ACTION: If they seem ready for a formal estimate, politely suggest they use the "Get Free Quote" button in the header.
        6. LANGUAGE: Always respond in clear, professional English.`
      },
      ...history,
      { role: "user", content: prompt }
    ];

    const response = await ai.chat.completions.create({
      model: chatModel,
      messages,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "Our experts are currently reviewing your request.";
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    
    // Provide more helpful error messages for common issues
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      return "I'm currently receiving a lot of requests. Please try again in a few minutes.";
    }
    
    if (error.message?.includes("MISSING_API_KEY") || error.message?.includes("invalid_api_key")) {
      return "The AI service is not configured correctly. Please check the API key settings.";
    }

    return "I'm having a brief technical moment. Please try again later.";
  }
};

/**
 * Utility to parse JSON safely from LLM responses, handles markdown blocks and conversational prefixes.
 */
export const parseAIJSON = (text: string): any => {
  let cleaned = text.trim();
  
  // Remove markdown wrapper if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(json)?/i, "").replace(/```$/i, "").trim();
  }
  
  // Find first '{' and last '}'
  const startIdx = cleaned.indexOf("{");
  const endIdx = cleaned.lastIndexOf("}");
  
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const jsonString = cleaned.substring(startIdx, endIdx + 1);
    return JSON.parse(jsonString);
  }
  
  return JSON.parse(cleaned);
};
