import React from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
  title: string;
  actionButton?: React.ReactNode;
}

export const MarkdownView: React.FC<Props> = ({ content, title, actionButton }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        
        <div className="p-8 prose prose-slate max-w-none prose-headings:text-slate-800 prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2 prose-h3:text-lg prose-p:text-slate-600 prose-li:text-slate-600">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>

      {actionButton && (
        <div className="flex justify-end sticky bottom-6">
          {actionButton}
        </div>
      )}
    </div>
  );
};
