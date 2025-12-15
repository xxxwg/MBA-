import React from 'react';
import { ThesisTopic } from '../types';
import { CheckCircle2, BookOpen, BarChart3, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  topics: ThesisTopic[];
  selectedTopic: ThesisTopic | null;
  onSelect: (topic: ThesisTopic) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const TopicSelector: React.FC<Props> = ({ topics, selectedTopic, onSelect, onConfirm, isLoading }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Select Your Thesis Topic</h2>
        <p className="text-slate-500 mt-2">We've generated 5 personalized topics based on your profile. Choose one to proceed to the outline.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {topics.map((topic, index) => {
          const isSelected = selectedTopic?.title === topic.title;
          return (
            <div 
              key={index}
              onClick={() => onSelect(topic)}
              className={clsx(
                "relative bg-white rounded-xl p-6 cursor-pointer transition-all duration-200 border-2",
                isSelected 
                  ? "border-primary shadow-lg scale-[1.01]" 
                  : "border-transparent shadow hover:shadow-md hover:border-indigo-100"
              )}
            >
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" fill="currentColor" color="white" />
                </div>
              )}
              
              <h3 className="text-lg font-bold text-slate-800 pr-8 mb-2">{topic.title}</h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{topic.background}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">Theoretical Perspective</span>
                  <span className="text-slate-700">{topic.theoretical_perspective}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">Data Source</span>
                  <span className="text-slate-700">{topic.data_sources}</span>
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-700 text-sm mb-2 flex items-center gap-1">
                        <BookOpen className="w-4 h-4" /> Research Questions
                      </h4>
                      <ul className="list-disc list-outside ml-4 space-y-1">
                        {topic.research_questions.map((q, i) => (
                          <li key={i} className="text-sm text-slate-600">{q}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700 text-sm mb-2 flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" /> Advisor & Feasibility
                      </h4>
                      <p className="text-sm text-slate-600 mb-2">
                        <span className="font-medium text-slate-700">Why Advisor Likes It:</span> {topic.advisor_acceptance_reason}
                      </p>
                      <div className="flex items-center gap-2">
                         <span className="text-sm text-slate-500">Feasibility:</span>
                         <span className={clsx(
                           "px-2 py-0.5 rounded text-xs font-bold",
                           (topic.feasibility === 'High' || topic.feasibility === '高') ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                         )}>
                           {topic.feasibility}
                         </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onConfirm}
          disabled={!selectedTopic || isLoading}
          className="bg-primary hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium shadow-md flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating Outline...' : 'Confirm Topic & Generate Outline'}
          {!isLoading && <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
