import OpenAI from 'openai';

/**
 * Helper to ensure the AI client is initialized with a valid key.
 * This function works seamlessly on Vercel as long as the OPENAI_API_KEY 
 * environment variable is set in the project dashboard.
 */
export const getAIClient = () => {
  // Robust API key detection for both local and Vercel environments
  const apiKey = process.env.OPENAI_API_KEY || 
                 (import.meta.env && import.meta.env.VITE_OPENAI_API_KEY);
  
  if (!apiKey || apiKey === "undefined" || apiKey === "null" || apiKey === "") {
    console.error("CRITICAL: OPENAI_API_KEY is missing from environment.");
    throw new Error("MISSING_API_KEY: The 'OPENAI_API_KEY' environment variable is not configured correctly. If you've deployed to Vercel, please add OPENAI_API_KEY to your Environment Variables in the Vercel Dashboard and REDEPLOY your app.");
  }
  
  // Log a sanitized version of the key to verify it's being picked up on Vercel
  if (process.env.NODE_ENV !== 'production' || true) { // Force log for debugging Vercel issues
    console.log("AI Client initialization check - Key starts with:", apiKey.substring(0, 4) + "...");
    if (!apiKey.startsWith('sk-')) {
      console.warn("WARNING: The detected OPENAI_API_KEY does not appear to be a valid OpenAI API key (expected to start with 'sk-'). Please check your Vercel environment variables.");
    }
  }
  
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
};

/**
 * Service to interact with OpenAI for lead assistance.
 */
export const getAIResponse = async (prompt: string, history: { role: 'user' | 'assistant', content: string }[]) => {
  try {
    const openai = getAIClient();
    
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

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "Our experts are currently reviewing your request.";
  } catch (error: any) {
    console.error("OpenAI Chat Error:", error);
    
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
