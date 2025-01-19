import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Download, FileText, RotateCcw } from 'lucide-react';
import { usePDF } from 'react-to-pdf';
import ResumeForm from './components/ResumeForm';
import Resume from './components/Resume';
import { FormState, ResumeData } from './types';

// Initialize Gemini AI with the provided API key
const genAI = new GoogleGenerativeAI('AIzaSyDIdZ_E02b_ASlQmz3o4tF6ACmo5cJbdfw');

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toPDF, targetRef } = usePDF({
    filename: 'resume.pdf'
  });

  const generateResume = async (formData: FormState) => {
    setIsLoading(true);
    setError(null);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `Create a professional resume in JSON format for a ${formData.jobTitle} with ${formData.yearsOfExperience} years of experience.
        Name: ${formData.fullName}
        Email: ${formData.email}
        Phone: ${formData.phone}
        Location: ${formData.location}
        LinkedIn: ${formData.linkedin}
        Website: ${formData.website}
        Skills: ${formData.keySkills}
        Previous roles: ${formData.previousRoles}
        Education: ${formData.education}
        
        The response MUST be a valid JSON object with EXACTLY this structure and all fields are required:
        {
          "fullName": "${formData.fullName}",
          "title": "${formData.jobTitle}",
          "email": "${formData.email}",
          "phone": "${formData.phone}",
          "location": "${formData.location}",
          "linkedin": "${formData.linkedin}",
          "website": "${formData.website}",
          "summary": "Professional summary...",
          "experience": [
            {
              "company": "Company Name",
              "position": "Position Title",
              "startDate": "Jan 2020",
              "endDate": "Present",
              "description": ["Achievement 1", "Achievement 2", "Achievement 3"]
            }
          ],
          "education": [
            {
              "school": "University Name",
              "degree": "Bachelor's/Master's",
              "field": "Field of Study",
              "graduationDate": "2020"
            }
          ],
          "skills": ["Skill 1", "Skill 2", "Skill 3"],
          "template": "${formData.template}",
          "accentColor": "${formData.accentColor}"
        }

        Important:
        1. Ensure all dates are in a consistent format (e.g., "Jan 2020")
        2. Include at least 3 detailed bullet points for each experience
        3. Make the summary concise but impactful (2-3 sentences)
        4. Format skills as an array of strings
        5. Use realistic, professional content
        6. Keep the experience descriptions achievement-focused and quantifiable`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const parsedData = JSON.parse(text);
        
        // Validate the parsed data structure
        const requiredFields = [
          'fullName', 'title', 'email', 'phone', 'location', 'linkedin', 'website',
          'summary', 'experience', 'education', 'skills', 'template', 'accentColor'
        ];
        const missingFields = requiredFields.filter(field => !(field in parsedData));
        
        if (missingFields.length > 0) {
          throw new Error(`Invalid response format. Missing fields: ${missingFields.join(', ')}`);
        }

        // Validate arrays
        if (!Array.isArray(parsedData.experience) || !Array.isArray(parsedData.education) || !Array.isArray(parsedData.skills)) {
          throw new Error('Invalid response format. Experience, education, and skills must be arrays.');
        }

        setResumeData(parsedData as ResumeData);
      } catch (parseError) {
        throw new Error('Failed to parse AI response. Please try again.');
      }
    } catch (error) {
      console.error('Error generating resume:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResumeData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">AI Resume Builder</h1>
            </div>
            {resumeData && (
              <div className="flex space-x-4">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <RotateCcw className="-ml-1 mr-2 h-4 w-4" />
                  Start Over
                </button>
                <button
                  onClick={() => toPDF()}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download className="-ml- 1 mr-2 h-4 w-4" />
                  Download PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {!resumeData && (
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                {error && (
                  <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                <ResumeForm onSubmit={generateResume} isLoading={isLoading} />
              </div>
            </div>
          )}

          {resumeData && (
            <div ref={targetRef}>
              <Resume data={resumeData} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;