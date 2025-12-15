import React from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  score: number; // 0-100
}

const data = [
  {
    name: 'Academic Value',
    uv: 85,
    fill: '#8884d8',
  },
  {
    name: 'Data Accessibility',
    uv: 90,
    fill: '#83a6ed',
  },
  {
    name: 'Practicality',
    uv: 95,
    fill: '#8dd1e1',
  }
];

// Simple visual to accompany the text report
export const FeasibilityGauge: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm h-64 mb-6">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Feasibility Dimensions</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" barSize={15} data={data}>
          <RadialBar
            label={{ position: 'insideStart', fill: '#fff' }}
            background
            dataKey="uv"
          />
          <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{
             top: '50%',
             right: 0,
             transform: 'translate(0, -50%)',
             lineHeight: '24px',
          }}/>
          <Tooltip />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};
