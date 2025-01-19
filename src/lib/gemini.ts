import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyDIdZ_E02b_ASlQmz3o4tF6ACmo5cJbdfw');

export async function generateResume(prompt: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const result = await model.generateContent(`
    Create a professional resume section based on the following information. 
    Format it professionally and include relevant details: ${prompt}
  `);
  
  const response = await result.response;
  return response.text();
}

export async function generateJobDescription(role: string, experience: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const result = await model.generateContent(`
    Create a professional job description for a ${role} position with ${experience} years of experience.
    Include key responsibilities and requirements.
  `);
  
  const response = await result.response;
  return response.text();
}