import React from 'react';
import { Persona } from '../types';
import { Briefcase, Target, Brain, Database, ArrowRight } from 'lucide-react';

interface Props {
  persona: Persona;
  onNext: () => void;
  isLoading: boolean;
}

export const PersonaView: React.FC<Props> = ({ persona, onNext, isLoading }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-indigo-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6" />
            MBA Research Persona
          </h2>
          <p className="text-indigo-100 text-sm mt-1">Based on your resume and professional background</p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3">Career Identity</h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex items-start gap-3 mb-2">
                  <Briefcase className="w-5 h-5 text-indigo-500 mt-0.5" />
                  <div>
                    <span className="block text-sm text-slate-500">Career Stage</span>
                    <span className="font-semibold text-slate-800">{persona.career_stage}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {persona.industry_keywords.map((kw, i) => (
                    <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 font-medium">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3">Core Management Domains</h3>
              <div className="space-y-2">
                {persona.core_management_domains.map((domain, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700 bg-indigo-50 px-3 py-2 rounded-md border border-indigo-100">
                    <Target className="w-4 h-4 text-indigo-600" />
                    {domain}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3">Research Advantage</h3>
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 text-slate-700 text-sm leading-relaxed">
                {persona.unique_research_advantage}
              </div>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3">Methodology Fit</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {persona.suitable_thesis_types.map((type, i) => (
                  <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-sm font-medium">
                    {type}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <Database className="w-5 h-5 text-slate-500" />
                <div>
                  <span className="text-sm text-slate-500 block">Data Access Level</span>
                  <span className={`font-bold ${
                    persona.data_access_assessment.includes('高') || persona.data_access_assessment.includes('High') 
                    ? 'text-green-600' 
                    : 'text-amber-600'
                  }`}>
                    {persona.data_access_assessment}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={isLoading}
          className="bg-primary hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium shadow-md flex items-center gap-2 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating Topics...' : 'Generate Thesis Topics'}
          {!isLoading && <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
