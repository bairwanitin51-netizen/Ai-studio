
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AgentRole, ModelId, ProjectTemplateType } from "../types";
import { AGENT_PERSONAS } from "../constants";

// Helper for API Access
const getClient = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");
  return new GoogleGenAI({ apiKey });
};

export interface PlanStep {
  path: string;
  description: string;
  type: 'file' | 'folder';
  role: AgentRole;
}

/**
 * ARCHITECT AGENT
 * Analyzes the goal and produces a structured build plan.
 */
export const runArchitectAgent = async (goal: string): Promise<PlanStep[]> => {
  const ai = getClient();
  const prompt = `
    ${AGENT_PERSONAS.ARCHITECT}
    
    User Goal: "${goal}"
    
    Create a detailed file structure plan. 
    Decide if this should be an Android (Kotlin/Compose) app, a Web (React) app, or a Backend service based on the goal.
    
    Return ONLY a JSON object with this structure:
    {
      "files": [
        { "path": "app/src/main/java/com/app/MainActivity.kt", "type": "file", "role": "DEVELOPER", "description": "Main Compose Activity" },
        { "path": "app/src/main/java/com/app/ui/Theme.kt", "type": "file", "role": "UI_DESIGNER", "description": "App Theme definition" }
      ]
    }
    Limit to 5-8 essential files for a working prototype.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: ModelId.GEMINI_PRO,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    const text = response.text || "{}";
    const data = JSON.parse(text);
    return data.files || [];
  } catch (e) {
    console.error("Architect failed", e);
    // Fallback plan
    return [
      { path: 'README.md', type: 'file', role: AgentRole.DEVELOPER, description: 'Project documentation' }
    ];
  }
};

/**
 * DEVELOPER / UI DESIGNER AGENT
 * Generates code based on role and description.
 */
export const runSpecializedAgent = async (
  role: AgentRole, 
  path: string, 
  description: string, 
  goal: string,
  existingCode: string = ""
): Promise<string> => {
  const ai = getClient();
  
  let persona = AGENT_PERSONAS.DEVELOPER;
  if (role === AgentRole.UI_DESIGNER) persona = AGENT_PERSONAS.UI_DESIGNER;
  if (role === AgentRole.DATABASE) persona = AGENT_PERSONAS.DATABASE;

  const prompt = `
    ${persona}
    
    Project Goal: "${goal}"
    File Path: "${path}"
    Task: ${description}
    
    ${existingCode ? `Existing Code:\n${existingCode}\n\nReview and Fix/Update.` : 'Write the full code for this file from scratch.'}
    
    Output ONLY the valid code. No markdown backticks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: ModelId.GEMINI_FLASH,
      contents: prompt,
    });

    let text = response.text || "";
    text = text.replace(/^```[a-z]*\n/i, '').replace(/```$/, '');
    return text.trim();
  } catch (e) {
    console.error(`${role} failed`, e);
    return `// Error generating code for ${path}`;
  }
};

/**
 * DEBUGGER AGENT
 * Analyzes code and returns fixed version.
 */
export const runDebuggerAgent = async (code: string, error: string): Promise<string> => {
  const ai = getClient();
  const prompt = `
    ${AGENT_PERSONAS.DEBUGGER}
    
    Error Log: "${error}"
    
    Code:
    ${code}
    
    Fix the code to resolve the error. Return ONLY the fixed code.
  `;

  const response = await ai.models.generateContent({
    model: ModelId.GEMINI_FLASH,
    contents: prompt,
  });

  let text = response.text || code;
  text = text.replace(/^```[a-z]*\n/i, '').replace(/```$/, '');
  return text.trim();
};
