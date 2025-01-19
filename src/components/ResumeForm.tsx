import React, { useState } from 'react';
import { FormState } from '../types';
import { FileText, Loader, User, Briefcase, GraduationCap, Palette } from 'lucide-react';

interface ResumeFormProps {
  onSubmit: (formData: FormState) => Promise<void>;
  isLoading: boolean;
}

const templates = [
  { id: 'modern', name: 'Modern', description: 'Clean and contemporary design with a focus on visual hierarchy' },
  { id: 'classic', name: 'Classic', description: 'Traditional layout perfect for conventional industries' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant design that lets your content shine' },
] as const;

const accentColors = [
  { id: 'blue-600', name: 'Blue', class: 'bg-blue-600' },
  { id: 'emerald-600', name: 'Emerald', class: 'bg-emerald-600' },
  { id: 'violet-600', name: 'Violet', class: 'bg-violet-600' },
  { id: 'rose-600', name: 'Rose', class: 'bg-rose-600' },
  { id: 'amber-600', name: 'Amber', class: 'bg-amber-600' },
] as const;

export default function ResumeForm({ onSubmit, isLoading }: ResumeFormProps) {
  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    jobTitle: '',
    yearsOfExperience: '',
    keySkills: '',
    previousRoles: '',
    education: '',
    template: 'modern',
    accentColor: 'blue-600'
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        ></div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-between mb-8">
        {['Personal Info', 'Experience', 'Customization', 'Review'].map((step, index) => (
          <button
            key={step}
            type="button"
            onClick={() => setCurrentStep(index + 1)}
            className={`flex flex-col items-center space-y-2 ${
              currentStep >= index + 1 ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= index + 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
            }`}>
              {index + 1}
            </div>
            <span className="text-xs font-medium">{step}</span>
          </button>
        ))}
      </div>

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700 mb-4">
            <User className="w-5 h-5" />
            <h2>Personal Information</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="City, Country"
              />
            </div>
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                LinkedIn Profile
              </label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Personal Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Experience */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700 mb-4">
            <Briefcase className="w-5 h-5" />
            <h2>Professional Experience</h2>
          </div>
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
              Desired Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
              Years of Experience
            </label>
            <input
              type="text"
              id="yearsOfExperience"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="keySkills" className="block text-sm font-medium text-gray-700">
              Key Skills (comma separated)
            </label>
            <textarea
              id="keySkills"
              name="keySkills"
              value={formData.keySkills}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="previousRoles" className="block text-sm font-medium text-gray-700">
              Previous Roles and Responsibilities
            </label>
            <textarea
              id="previousRoles"
              name="previousRoles"
              value={formData.previousRoles}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="education" className="block text-sm font-medium text-gray-700">
              Education Background
            </label>
            <textarea
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      )}

      {/* Step 3: Customization */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700 mb-4">
            <Palette className="w-5 h-5" />
            <h2>Customize Your Resume</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Choose a Template
            </label>
            <div className="grid grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    formData.template === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                  onClick={() => handleChange({ target: { name: 'template', value: template.id } } as any)}
                >
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Choose an Accent Color
            </label>
            <div className="flex space-x-4">
              {accentColors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  className={`w-8 h-8 rounded-full ${color.class} ${
                    formData.accentColor === color.id
                      ? 'ring-2 ring-offset-2 ring-blue-500'
                      : ''
                  }`}
                  onClick={() => handleChange({ target: { name: 'accentColor', value: color.id } } as any)}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700 mb-4">
            <FileText className="w-5 h-5" />
            <h2>Review Your Information</h2>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Personal Information</h3>
                <p className="mt-1">{formData.fullName}</p>
                <p className="text-sm text-gray-600">{formData.email}</p>
                <p className="text-sm text-gray-600">{formData.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Professional</h3>
                <p className="mt-1">{formData.jobTitle}</p>
                <p className="text-sm text-gray-600">{formData.yearsOfExperience} years of experience</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Skills</h3>
              <p className="mt-1 text-sm text-gray-600">{formData.keySkills}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Template</h3>
              <p className="mt-1 text-sm text-gray-600">
                {templates.find(t => t.id === formData.template)?.name}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-6">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Previous
          </button>
        )}
        
        {currentStep < 4 ? (
          <button
            type="button"
            onClick={nextStep}
            className="ml-auto inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="ml-auto inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Generating Resume...
              </>
            ) : (
              <>
                <FileText className="-ml-1 mr-2 h-4 w-4" />
                Generate Resume
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}