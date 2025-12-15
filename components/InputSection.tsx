import React, { ChangeEvent } from 'react';
import { UserProfile } from '../types';
import { Upload, FileText, X } from 'lucide-react';

interface Props {
  user: UserProfile;
  onChange: (field: keyof UserProfile, value: any) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputSection: React.FC<Props> = ({ user, onChange, onSubmit, isLoading }) => {
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert("Please upload a PDF file.");
        return;
      }
      onChange('resumeFile', file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange('resumeBase64', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    onChange('resumeFile', null);
    onChange('resumeBase64', null);
  };

  const isFormValid = user.age && user.company && user.industry && user.position && user.years && user.resumeFile;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Profile & Background</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
          <input
            type="number"
            value={user.age}
            onChange={(e) => onChange('age', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            placeholder="e.g. 35"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Work Experience (Years)</label>
          <input
            type="number"
            value={user.years}
            onChange={(e) => onChange('years', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            placeholder="e.g. 10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
          <input
            type="text"
            value={user.company}
            onChange={(e) => onChange('company', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            placeholder="Current Employer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
          <input
            type="text"
            value={user.industry}
            onChange={(e) => onChange('industry', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            placeholder="e.g. FinTech"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Current Position</label>
          <input
            type="text"
            value={user.position}
            onChange={(e) => onChange('position', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            placeholder="e.g. Senior Product Manager"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Resume (PDF)</label>
          {!user.resumeFile ? (
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition group relative">
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-primary mb-2 transition" />
              <p className="text-sm text-slate-500 group-hover:text-primary">Click to upload or drag & drop</p>
              <p className="text-xs text-slate-400 mt-1">PDF only, max 5MB</p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm font-medium text-slate-800">{user.resumeFile.name}</p>
                  <p className="text-xs text-slate-500">{(user.resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={removeFile}
                className="p-1 hover:bg-slate-200 rounded-full transition"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={onSubmit}
          disabled={!isFormValid || isLoading}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium text-lg transition flex items-center justify-center gap-2
            ${!isFormValid || isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-indigo-700 shadow-md hover:shadow-lg'}
          `}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Profile...
            </>
          ) : (
            'Analyze Profile & Generate Persona'
          )}
        </button>
      </div>
    </div>
  );
};
