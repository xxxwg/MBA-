import React, { useState } from 'react';
import { Step, UserProfile, Persona, ThesisTopic, AppState } from './types';
import { generatePersona, generateTopics, generateOutline, generateFeasibility } from './services/geminiService';
import { InputSection } from './components/InputSection';
import { PersonaView } from './components/PersonaView';
import { TopicSelector } from './components/TopicSelector';
import { MarkdownView } from './components/MarkdownView';
import { FeasibilityGauge } from './components/FeasibilityCharts';
import { ChevronRight, GraduationCap } from 'lucide-react';

const initialState: AppState = {
  step: Step.INPUT,
  user: {
    age: '',
    company: '',
    industry: '',
    position: '',
    years: '',
    resumeFile: null,
    resumeBase64: null,
  },
  persona: null,
  topics: [],
  selectedTopic: null,
  outline: '',
  feasibilityReport: '',
  isLoading: false,
  error: null,
};

function App() {
  const [state, setState] = useState<AppState>(initialState);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const updateUser = (field: keyof UserProfile, value: any) => {
    setState(prev => ({
      ...prev,
      user: { ...prev.user, [field]: value }
    }));
  };

  const handleError = (err: any) => {
    updateState({ 
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
      isLoading: false 
    });
  };

  // --- Handlers ---

  const handleGeneratePersona = async () => {
    updateState({ isLoading: true, error: null });
    try {
      const persona = await generatePersona(state.user);
      updateState({ persona, step: Step.PERSONA, isLoading: false });
    } catch (err) {
      handleError(err);
    }
  };

  const handleGenerateTopics = async () => {
    if (!state.persona) return;
    updateState({ isLoading: true, error: null });
    try {
      const topics = await generateTopics(state.persona);
      updateState({ topics, step: Step.TOPICS, isLoading: false });
    } catch (err) {
      handleError(err);
    }
  };

  const handleGenerateOutline = async () => {
    if (!state.selectedTopic) return;
    updateState({ isLoading: true, error: null });
    try {
      const outline = await generateOutline(state.selectedTopic);
      updateState({ outline, step: Step.OUTLINE, isLoading: false });
    } catch (err) {
      handleError(err);
    }
  };

  const handleGenerateFeasibility = async () => {
    if (!state.selectedTopic || !state.outline) return;
    updateState({ isLoading: true, error: null });
    try {
      const feasibilityReport = await generateFeasibility(state.selectedTopic, state.outline);
      updateState({ feasibilityReport, step: Step.FEASIBILITY, isLoading: false });
    } catch (err) {
      handleError(err);
    }
  };

  // --- Render Steps ---

  const renderStep = () => {
    switch (state.step) {
      case Step.INPUT:
        return (
          <InputSection 
            user={state.user} 
            onChange={updateUser} 
            onSubmit={handleGeneratePersona} 
            isLoading={state.isLoading} 
          />
        );
      case Step.PERSONA:
        return state.persona ? (
          <PersonaView 
            persona={state.persona} 
            onNext={handleGenerateTopics} 
            isLoading={state.isLoading} 
          />
        ) : null;
      case Step.TOPICS:
        return (
          <TopicSelector 
            topics={state.topics} 
            selectedTopic={state.selectedTopic} 
            onSelect={(t) => updateState({ selectedTopic: t })} 
            onConfirm={handleGenerateOutline} 
            isLoading={state.isLoading} 
          />
        );
      case Step.OUTLINE:
        return (
          <MarkdownView 
            title={`Thesis Outline: ${state.selectedTopic?.title}`}
            content={state.outline}
            actionButton={
              <button
                onClick={handleGenerateFeasibility}
                disabled={state.isLoading}
                className="bg-primary hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium shadow-md flex items-center gap-2 transition disabled:opacity-70"
              >
                {state.isLoading ? 'Analyzing Feasibility...' : 'Analyze Feasibility & Risks'}
                {!state.isLoading && <ChevronRight className="w-5 h-5" />}
              </button>
            }
          />
        );
      case Step.FEASIBILITY:
        return (
          <div className="max-w-4xl mx-auto">
             <FeasibilityGauge />
             <MarkdownView 
              title="Feasibility & Defense Strategy Report"
              content={state.feasibilityReport}
              actionButton={
                <button
                  onClick={() => updateState({ step: Step.TOPICS, selectedTopic: null, outline: '', feasibilityReport: '' })}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition"
                >
                  Select Another Topic
                </button>
              }
            />
          </div>
        );
      default:
        return null;
    }
  };

  // --- Layout ---

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">MBA Thesis Architect</h1>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            AI-Powered Advisor
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-100">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out" 
            style={{ width: `${((state.step + 1) / 5) * 100}%` }}
          />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {state.error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <strong>Error:</strong> {state.error}
          </div>
        )}
        
        {renderStep()}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} MBA Thesis Architect. Powered by Gemini.
        </div>
      </footer>
    </div>
  );
}

export default App;
