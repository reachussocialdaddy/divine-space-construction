import { GoogleGenAI, Type } from "@google/genai";

/**
 * Helper to ensure the AI client is initialized with a valid key.
 * This function works seamlessly on Vercel as long as the GEMINI_API_KEY 
 * environment variable is set in the project dashboard.
 */
export const getAIClient = () => {
  // Robust API key detection for both local and Vercel environments
  const apiKey = process.env.GEMINI_API_KEY || 
                 (import.meta.env && import.meta.env.VITE_GEMINI_API_KEY);
  
  if (!apiKey || apiKey === "undefined" || apiKey === "null" || apiKey === "") {
    console.error("CRITICAL: GEMINI_API_KEY is missing from environment.");
    throw new Error("MISSING_API_KEY: The 'GEMINI_API_KEY' environment variable is not configured correctly. If you've deployed to Vercel, please add GEMINI_API_KEY to your Environment Variables in the Vercel Dashboard and REDEPLOY your app.");
  }
  
  // Log a sanitized version of the key to verify it's being picked up on Vercel
  if (process.env.NODE_ENV !== 'production' || true) { // Force log for debugging Vercel issues
    console.log("AI Client initialization check - Key starts with:", apiKey.substring(0, 4) + "...");
    if (!apiKey.startsWith('AIza')) {
      console.warn("WARNING: The detected GEMINI_API_KEY does not appear to be a valid Google API key (expected to start with 'AIza'). Please check your Vercel environment variables.");
    }
  }
  
  return new GoogleGenAI({ apiKey });
};

/**
 * Service to interact with Google Gemini AI for lead assistance.
 */
export const getGeminiResponse = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    const ai = getAIClient();
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: `You are the Lead Architect for Divine Space Construction. 
        Your goal is to have a natural, human-like conversation with potential clients, similar to how a professional consultant would talk in person.
        
        CONVERSATION GUIDELINES:
        1. BE CONCISE: Never send long paragraphs. Keep your replies short and easy to read.
        2. BE HUMAN: Use a warm, professional, and helpful tone. Avoid sounding like a rigid bot.
        3. UNDERSTAND REQUIREMENTS: Start by understanding what the user needs. Ask one question at a time to keep the conversation flowing.
        4. SERVICES: We specialize in luxury home renovations, basement finishing, kitchen remodeling, and custom home builds in the GTA.
        5. CALL TO ACTION: If they seem ready for a formal estimate, politely suggest they use the "Get Free Quote" button in the header.
        6. LANGUAGE: Always respond in clear, professional English.`,
        temperature: 0.7,
      },
    });

    return response.text || "Our experts are currently reviewing your request.";
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    
    // Provide more helpful error messages for common issues
    if (error.message?.includes("429") || error.message?.includes("QUOTA")) {
      return "I'm currently receiving a lot of requests. Please try again in a few minutes.";
    }
    
    if (error.message?.includes("MISSING_API_KEY") || error.message?.includes("API_KEY_INVALID")) {
      return "The AI service is not configured correctly. Please check the API key settings.";
    }

    return "I'm having a brief technical moment. Please try again later.";
  }
};

/**
 * Uses Gemini AI to analyze a room image and detect layers with architectural precision.
 * Switched to gemini-3-flash-preview to ensure reliability and avoid Quota Exceeded (429) errors 
 * while maintaining deep spatial reasoning.
 */
export const analyzeRoomSurfaces = async (base64Image: string, mimeType: string) => {
  try {
    const ai = getAIClient();
    
    const imagePart = {
      inlineData: {
        data: base64Image.split(',')[1],
        mimeType: mimeType,
      },
    };

    const promptPart = {
      text: `Act as a PIXEL-PERFECT 3D ARCHITECTURAL SCANNER. 
      Perform an ULTIMATE DEEP SCAN of this kitchen or room image. 
      
      ACCURACY DIRECTIVES FOR 100% COVERAGE:
      1. CABINETS & FURNITURE: Identify EVERY cabinet door, drawer front, and side panel.
         - Ensure ZERO GAPS between adjacent pieces of furniture.
         - Trace the entire surface of the cabinetry seamlessly.
         - Do not leave any small gaps or fragments.
      2. WALLS & FLOORS: Trace the entire wall surface from edge to edge. Identify the floor plane precisely.
      3. OCCLUSIONS (PROTECTION LAYER): Detect handles, knobs, faucets, and small kitchen appliances.
         - Trace tightly around these objects so they remain uncolored while the furniture behind/around them is customized.
      
      The segmentation must be SEAMLESS and PROFESSIONAL.
      Provide coordinates as [x, y] points (0.0 to 1.0).
      Output strict JSON.
      
      Structure:
      {
        "walls": [[[x1,y1], [x2,y2], ...]],
        "floors": [[[x1,y1], [x2,y2], ...]],
        "cabinets": [[[x1,y1], [x2,y2], ...]],
        "occlusions": [[[x1,y1], [x2,y2], ...]]
      }`
    };

    // Switched to Flash for better availability and quota management
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: [{ parts: [imagePart, promptPart] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            walls: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.NUMBER } } } },
            floors: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.NUMBER } } } },
            cabinets: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.NUMBER } } } },
            occlusions: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }
          },
          required: ["walls", "floors", "cabinets", "occlusions"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("EMPTY_MODEL_RESPONSE");

    return JSON.parse(jsonText);
  } catch (error: any) {
    console.error("Gemini Vision Scan Failed:", error);
    // Sanitize the error message if it's a quota error
    if (error.message?.includes("429") || error.message?.includes("QUOTA")) {
      throw new Error("AI Quota Exceeded: Please try again in a few minutes or check your API billing limits.");
    }
    throw error;
  }
};