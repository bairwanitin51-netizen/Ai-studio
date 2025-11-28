
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AgentRole, ModelId, AgentTask } from "../types";
import { AGENT_PERSONAS } from "../constants";

const getClient = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");
  return new GoogleGenAI({ apiKey });
};

// The Orchestrator plans the entire session
export const orchestrateGoal = async (userGoal: string): Promise<AgentTask[]> => {
  const ai = getClient();
  const prompt = `
    ${AGENT_PERSONAS.ORCHESTRATOR}
    
    DIRECTIVE: "${userGoal}"
    
    ANALYSIS:
    Break this down into highly technical, atomic tasks.
    If Android app -> ARCHITECT (Plan), UI_DESIGNER (Compose), DEVELOPER (Logic), BUILDER (APK).
    If Web app -> ARCHITECT (Plan), UI_DESIGNER (React), BACKEND (API), DEVOPS (Deploy).
    
    CONSTRAINT:
    Return ONLY a JSON array. No markdown.
    Example:
    [
      { "role": "ARCHITECT", "description": "Define schema for Users and Posts tables" },
      { "role": "UI_DESIGNER", "description": "Implement LoginScreen.kt with Material3" }
    ]
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: ModelId.GEMINI_PRO,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    const text = response.text || "[]";
    const tasks = JSON.parse(text);
    
    return tasks.map((t: any) => ({
      id: Math.random().toString(36).substr(2, 9),
      role: t.role as AgentRole,
      description: t.description,
      status: 'pending',
      logs: []
    }));
  } catch (e) {
    console.error("Orchestration failed", e);
    return [{
      id: 'fallback',
      role: AgentRole.DEVELOPER,
      description: "Execute user directive immediately.",
      status: 'pending',
      logs: []
    }];
  }
};

export const executeAgentTask = async (
  task: AgentTask, 
  projectContext: string
): Promise<{ code?: string, output: string }> => {
  const ai = getClient();
  
  const persona = AGENT_PERSONAS[task.role] || AGENT_PERSONAS.DEVELOPER;
  
  const prompt = `
    ${persona}
    
    CONTEXT:
    ${projectContext.substring(0, 3000)}...
    
    TASK: ${task.description}
    
    REQUIREMENTS:
    - Production quality code.
    - Full file content (imports, classes, main).
    - No placeholders.
    - If UI, use modern framework (Compose/React).
    
    OUTPUT:
    Return the code block ONLY.
  `;

  try {
    const response = await ai.models.generateContent({
      model: ModelId.GEMINI_FLASH,
      contents: prompt,
    });
    
    let text = response.text || "";
    let code = undefined;
    if (text.includes('```')) {
        code = text.replace(/^```[a-z]*\n/i, '').replace(/```$/, '').trim();
    }
    
    return { code, output: text };
  } catch (e) {
    return { output: `Error executing task: ${e}` };
  }
};
