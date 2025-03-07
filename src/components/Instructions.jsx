import React from 'react';
import { ClipboardList, Clock, AlertTriangle, MousePointer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Instructions() {
  const navigate = useNavigate();

  // Array of instruction objects
  const instructions = [
    {
      icon: <Clock className="h-6 w-6 text-blue-400 mt-1" />,
      title: "Time Limit",
      description: "You have 20 minutes to complete the quiz. The timer will continue even if you refresh the page.",
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-yellow-400 mt-1" />,
      title: "Browser Tab Restriction",
      description: "Switching to other browser tabs will trigger a warning. The quiz will be auto-submitted if you proceed to switch tabs.",
    },
    {
      icon: <MousePointer className="h-6 w-6 text-green-400 mt-1" />,
      title: "Navigation",
      description: "Use the table navigation buttons to view different SQL tables. Answer all questions based on the displayed table.",
    },
    {
      icon: <ClipboardList className="h-6 w-6 text-purple-400 mt-1" />,
      title: "Answering Questions",
      description: "Type your SQL queries in the provided input fields. Copy-paste functionality is disabled for security.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          Quiz Instructions
        </h2>
        <p className="mt-2 text-gray-400">Please read carefully before starting</p>
      </div>

      <div className="space-y-6">
        {instructions.map((instruction, index) => (
          <div key={index} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="flex items-start">
              {instruction.icon}
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">{instruction.title}</h3>
                <p className="mt-1 text-gray-400">{instruction.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-6">
        <button
          className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold hover:from-blue-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          onClick={() => navigate("/quiz")}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}

export default Instructions;