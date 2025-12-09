import React, { useEffect, useState } from 'react';
import { fetchExerciseDetails, ExerciseGuide } from '../services/geminiService';
import { TaskItem } from '../types';

interface ExerciseModalProps {
  exercise: TaskItem | null;
  onClose: () => void;
}

const ExerciseModal: React.FC<ExerciseModalProps> = ({ exercise, onClose }) => {
  const [guide, setGuide] = useState<ExerciseGuide | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (exercise && exercise.exerciseName) {
      setLoading(true);
      setGuide(null);
      fetchExerciseDetails(exercise.exerciseName)
        .then(data => {
          setGuide(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [exercise]);

  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-indigo-600 p-4 sm:p-6 text-white shrink-0">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold">{exercise.exerciseName || exercise.text}</h3>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <p className="text-indigo-100 text-sm mt-1">AI-Powered Instruction</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm">Asking Gemini for tips...</p>
            </div>
          ) : guide ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Overview</h4>
                <p className="text-gray-700 leading-relaxed">{guide.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Key Tips</h4>
                <ul className="space-y-2">
                  {guide.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start text-gray-700 text-sm">
                      <span className="mr-2 text-indigo-500 mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-100">
                 <a 
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(guide.searchQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium group"
                 >
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                  Watch on YouTube
                 </a>
                 <p className="text-xs text-center text-gray-400 mt-2">Opens in a new tab</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Unable to load details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseModal;
