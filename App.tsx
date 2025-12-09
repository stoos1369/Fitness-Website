import React, { useState, useEffect } from 'react';
import { WEEKLY_SCHEDULE, MONTHS, ACHIEVEMENTS, Achievement } from './constants';
import { TaskItem, TaskType, WeekProgress, WeekDefinition, MonthDefinition } from './types';
import ExerciseModal from './components/ExerciseModal';

// --- Utility: Calculate Percentage ---
const calculateProgressPercentage = (items: WeekProgress): number => {
  let total = 0;
  let completed = 0;

  WEEKLY_SCHEDULE.forEach(day => {
    const allTasks = [...(day.lunch || []), ...(day.dinner || []), ...(day.workout || [])];
    allTasks.forEach(task => {
      if (!task.isSubHeader) {
        total++;
        if (items[task.id]) {
          completed++;
        }
      }
    });
  });

  return total === 0 ? 0 : Math.round((completed / total) * 100);
};

// --- Gamification Component ---
interface GamificationWidgetProps {
  totalCompleted: number;
}

const GamificationWidget: React.FC<GamificationWidgetProps> = ({ totalCompleted }) => {
  const [showRoadmap, setShowRoadmap] = useState(false);

  // Find current achievement level
  // We reverse the array to find the highest threshold passed
  const currentAchievement = [...ACHIEVEMENTS].reverse().find(a => totalCompleted >= a.threshold) || ACHIEVEMENTS[0];
  
  // Find next achievement
  const nextAchievement = ACHIEVEMENTS.find(a => a.threshold > totalCompleted);

  // Calculate progress to next level
  let progressPercent = 100;
  let nextThreshold = totalCompleted; // Default if maxed out

  if (nextAchievement) {
    const prevThreshold = currentAchievement.threshold;
    nextThreshold = nextAchievement.threshold;
    const range = nextThreshold - prevThreshold;
    const current = totalCompleted - prevThreshold;
    progressPercent = Math.min(100, Math.max(0, (current / range) * 100));
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 mb-8 relative overflow-hidden transition-all duration-300">
       <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${currentAchievement.colorFrom} ${currentAchievement.colorTo}`} />
       
       <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Icon / Avatar */}
          <div className={`w-20 h-20 shrink-0 rounded-full flex items-center justify-center text-4xl bg-gradient-to-br ${currentAchievement.colorFrom} ${currentAchievement.colorTo} text-white shadow-lg`}>
            {currentAchievement.icon}
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-2">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Status</p>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  {currentAchievement.title}
                  <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {totalCompleted} XP
                  </span>
                </h2>
                <p className="text-slate-500 text-sm mt-1 italic">"{currentAchievement.message}"</p>
              </div>
              
              {nextAchievement && (
                <div className="text-right mt-2 sm:mt-0">
                  <p className="text-xs font-semibold text-slate-400">Next: {nextAchievement.title}</p>
                  <p className="text-sm font-bold text-indigo-600">
                    {nextAchievement.threshold - totalCompleted} XP to go
                  </p>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
               <div 
                 className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${currentAchievement.colorFrom} ${currentAchievement.colorTo}`}
                 style={{ width: `${progressPercent}%` }}
               >
                 <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
               </div>
            </div>
          </div>
       </div>

       {/* Roadmap Toggle */}
       <div className="mt-6 border-t border-slate-100 pt-4 flex flex-col items-center">
         <button 
           onClick={() => setShowRoadmap(!showRoadmap)}
           className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors focus:outline-none"
         >
           {showRoadmap ? 'Hide Achievement Map' : 'View Achievement Roadmap'}
           <svg className={`w-4 h-4 transition-transform duration-300 ${showRoadmap ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
         </button>
         
         {/* Roadmap List */}
         {showRoadmap && (
            <div className="w-full mt-6 space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Milestones & Meanings</h3>
              <div className="grid grid-cols-1 gap-4">
                {ACHIEVEMENTS.map((ach) => {
                  const isUnlocked = totalCompleted >= ach.threshold;
                  return (
                    <div 
                      key={ach.threshold}
                      className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${
                        isUnlocked 
                          ? 'bg-slate-50 border-indigo-100 shadow-sm' 
                          : 'bg-white border-slate-100 opacity-60 grayscale'
                      }`}
                    >
                      <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br ${ach.colorFrom} ${ach.colorTo} text-white shadow-sm`}>
                        {ach.icon}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-center mb-1">
                           <h4 className={`font-bold ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                             {ach.title}
                           </h4>
                           <span className={`text-xs font-bold px-2 py-1 rounded-full ${isUnlocked ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
                             {ach.threshold} XP
                           </span>
                         </div>
                         <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wide">
                            {ach.insight}
                         </p>
                         <p className="text-sm text-slate-600 leading-relaxed italic">
                           "{ach.message}"
                         </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
         )}
       </div>
    </div>
  );
};

// --- Login / Profile Manager Component ---
const LoginScreen: React.FC<{ onLogin: (username: string) => void }> = ({ onLogin }) => {
  const [savedUsers, setSavedUsers] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('fitness_users_list');
      if (stored) {
        setSavedUsers(JSON.parse(stored));
      } else {
        setIsCreating(true); // Auto-show create if empty
      }
    } catch (e) {
      console.error(e);
      setIsCreating(true);
    }
  }, []);

  // Helper to calculate XP for a user based on stored data
  const getUserXP = (username: string): number => {
    try {
      const storedProgress = localStorage.getItem(`fitness_progress_${username}`);
      if (!storedProgress) return 0;
      
      const progress: Record<string, WeekProgress> = JSON.parse(storedProgress);
      let count = 0;
      Object.values(progress).forEach(week => {
        Object.values(week).forEach(isDone => {
          if (isDone) count++;
        });
      });
      return count;
    } catch (e) {
      return 0;
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;

    // Add to list if not exists
    if (!savedUsers.includes(name)) {
      const updated = [...savedUsers, name];
      setSavedUsers(updated);
      localStorage.setItem('fitness_users_list', JSON.stringify(updated));
    }
    onLogin(name);
  };

  const handleDelete = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete profile "${name}"? This deletes all progress data permanently.`)) {
       const updated = savedUsers.filter(u => u !== name);
       setSavedUsers(updated);
       localStorage.setItem('fitness_users_list', JSON.stringify(updated));
       localStorage.removeItem(`fitness_progress_${name}`);
       
       if (updated.length === 0) setIsCreating(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-fade-in relative overflow-hidden">
        <div className="text-center mb-8">
           <div className="inline-block p-3 rounded-full bg-indigo-100 text-indigo-600 mb-4">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
           </div>
           <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent mb-2">Fitness Tracker</h1>
           <p className="text-slate-500">Manage your profiles & progress.</p>
        </div>

        {/* User List */}
        {!isCreating && savedUsers.length > 0 && (
          <div className="space-y-3 mb-6">
             <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Select Profile</h2>
             <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
               {savedUsers.map(user => {
                 const xp = getUserXP(user);
                 return (
                   <div 
                     key={user}
                     onClick={() => onLogin(user)}
                     className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-md hover:bg-indigo-50/50 cursor-pointer transition-all group"
                   >
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
                           {user.charAt(0).toUpperCase()}
                         </div>
                         <div className="flex flex-col text-left">
                           <span className="font-semibold text-slate-700 leading-tight">{user}</span>
                           <span className="text-xs font-medium text-slate-400">{xp} XP</span>
                         </div>
                      </div>
                      <button 
                        onClick={(e) => handleDelete(user, e)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete Profile"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                   </div>
                 );
               })}
             </div>
             
             <button 
               onClick={() => setIsCreating(true)}
               className="w-full mt-4 py-3 border-2 border-dashed border-slate-200 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
               Create New Profile
             </button>
          </div>
        )}

        {/* Create Form */}
        {(isCreating || savedUsers.length === 0) && (
          <form onSubmit={handleCreate} className="space-y-6 animate-fade-in">
             <div className="text-left">
               <button 
                 type="button" 
                 onClick={() => savedUsers.length > 0 && setIsCreating(false)}
                 className={`text-sm text-indigo-600 font-medium mb-4 flex items-center gap-1 ${savedUsers.length === 0 ? 'hidden' : ''}`}
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                 Back to profiles
               </button>
               <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">New Profile Name</label>
               <input 
                  type="text" 
                  id="username"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                  placeholder="e.g. John Doe"
                  autoFocus
                />
             </div>
             <button 
                type="submit"
                disabled={!newName.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
              >
                Create & Start
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </button>
          </form>
        )}
        
        <div className="mt-8 text-center border-t border-slate-50 pt-4">
           <p className="text-xs text-slate-400">
             Data is stored locally on this device.
           </p>
        </div>
      </div>
    </div>
  );
};


// --- View: Month Overview ---
interface MonthViewProps {
  user: string;
  allProgress: Record<string, WeekProgress>;
  totalCompleted: number;
  onSelectWeek: (week: WeekDefinition) => void;
  onLogout: () => void;
}

const MonthView: React.FC<MonthViewProps> = ({ user, allProgress, totalCompleted, onSelectWeek, onLogout }) => {
  const [selectedMonthId, setSelectedMonthId] = useState<string>(MONTHS[0].id);

  const currentMonth = MONTHS.find(m => m.id === selectedMonthId) || MONTHS[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Fitness Tracker
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Profile: <span className="text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded-full">{user}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">Total Progress</span>
                <span className="text-indigo-600 font-bold">{totalCompleted} tasks</span>
             </div>
             <button 
               onClick={onLogout}
               className="text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
             >
               Switch Profile
             </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Gamification Header */}
        <GamificationWidget totalCompleted={totalCompleted} />

        {/* Month Selector */}
        <div className="mb-8">
          <label htmlFor="month-select" className="block text-sm font-medium text-slate-700 mb-2">Select Month</label>
          <div className="relative">
            <select
              id="month-select"
              value={selectedMonthId}
              onChange={(e) => setSelectedMonthId(e.target.value)}
              className="block w-full sm:w-auto min-w-[200px] pl-4 pr-10 py-3 text-base border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl shadow-sm bg-white cursor-pointer appearance-none"
            >
              {MONTHS.map(month => (
                <option key={month.id} value={month.id}>
                  {month.title}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 sm:right-auto sm:left-[170px] flex items-center px-2 text-slate-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>
        </div>

        {/* Weeks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {currentMonth.weeks.map((week) => {
            const weekProgress = allProgress[week.id] || {};
            const percent = calculateProgressPercentage(weekProgress);
            
            return (
              <button 
                key={week.id}
                onClick={() => onSelectWeek(week)}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 text-left relative overflow-hidden"
              >
                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                         {week.title}
                       </h3>
                       <p className="text-slate-500 font-medium text-sm mt-1 bg-slate-100 inline-block px-2 py-0.5 rounded">
                        {week.dateRange}
                       </p>
                     </div>
                     <span className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ml-2 ${
                       percent === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                     }`}>
                       {percent}% Done
                     </span>
                   </div>
                   
                   {/* Progress Bar */}
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                     <div 
                       className={`h-full transition-all duration-1000 ease-out rounded-full ${
                         percent === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                       }`}
                       style={{ width: `${percent}%` }}
                     />
                   </div>

                   <div className="flex items-center text-indigo-500 font-medium text-sm group-hover:translate-x-1 transition-transform">
                     Open Schedule
                     <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                   </div>
                </div>
                
                {/* Decoration */}
                <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

// --- View: Week Detail ---
interface WeekDetailProps {
  week: WeekDefinition;
  monthTitle: string;
  progress: WeekProgress;
  totalCompleted: number;
  onToggle: (taskId: string) => void;
  onBack: () => void;
}

const WeekDetailView: React.FC<WeekDetailProps> = ({ week, monthTitle, progress, totalCompleted, onToggle, onBack }) => {
  const [selectedExercise, setSelectedExercise] = useState<TaskItem | null>(null);
  const percent = calculateProgressPercentage(progress);

  const handleExerciseClick = (task: TaskItem) => {
    if (task.type === TaskType.WORKOUT && task.exerciseName) {
      setSelectedExercise(task);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={onBack}
                className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                title="Back to Month"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              </button>
              <div>
                <div className="flex items-center gap-2 text-sm text-indigo-600 font-semibold uppercase tracking-wider mb-0.5">
                  {monthTitle}
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {week.title} <span className="text-slate-400 font-normal text-lg ml-1">({week.dateRange})</span>
                </h1>
              </div>
            </div>
            
            {/* Simple Week Progress (Mini) */}
            <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-slate-400 uppercase">Week Progress</span>
                <span className="text-lg font-bold text-emerald-600">{percent}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Gamification Header (Compact version could go here, but let's show full for motivation) */}
        <GamificationWidget totalCompleted={totalCompleted} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {WEEKLY_SCHEDULE.map((day) => (
            <div 
              key={day.id} 
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300"
            >
              {/* Day Header */}
              <div className="bg-slate-800 p-4 text-white">
                <div className="flex justify-between items-center mb-1">
                  <h2 className="font-bold text-lg">{day.dayName}</h2>
                  {day.proteinGoal !== '-' && (
                     <span className="text-xs bg-indigo-500/20 border border-indigo-400/30 px-2 py-0.5 rounded text-indigo-200">
                       Protein: {day.proteinGoal}
                     </span>
                  )}
                </div>
                <p className="text-slate-300 text-sm font-medium">{day.title}</p>
              </div>

              {/* Day Content */}
              <div className="p-4 space-y-6 flex-1 flex flex-col">
                
                {/* Diet Section */}
                {(day.lunch?.length || day.dinner?.length) ? (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                      Diet
                    </h3>
                    
                    {day.lunch && day.lunch.length > 0 && (
                      <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                        <span className="text-xs font-semibold text-orange-800 block mb-2">Lunch</span>
                        <div className="space-y-2">
                          {day.lunch.map(task => (
                             <TaskRow key={task.id} task={task} isChecked={!!progress[task.id]} onToggle={() => onToggle(task.id)} />
                          ))}
                        </div>
                      </div>
                    )}

                    {day.dinner && day.dinner.length > 0 && (
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                        <span className="text-xs font-semibold text-blue-800 block mb-2">Dinner</span>
                        <div className="space-y-2">
                           {day.dinner.map(task => (
                             <TaskRow key={task.id} task={task} isChecked={!!progress[task.id]} onToggle={() => onToggle(task.id)} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}

                {/* Workout Section */}
                {day.workout && day.workout.length > 0 && (
                  <div className="space-y-3 flex-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                      Workout
                    </h3>
                    <div className="space-y-2">
                      {day.workout.map(task => (
                        <WorkoutRow 
                          key={task.id} 
                          task={task} 
                          isChecked={!!progress[task.id]} 
                          onToggle={() => onToggle(task.id)}
                          onShowDetails={() => handleExerciseClick(task)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer Progress (Per Day visual) */}
              <div className="h-1 bg-slate-100">
                 {(() => {
                    const tasks = [...(day.lunch || []), ...(day.dinner || []), ...(day.workout || [])].filter(t => !t.isSubHeader);
                    if (tasks.length === 0) return null;
                    const done = tasks.filter(t => progress[t.id]).length;
                    const pct = (done / tasks.length) * 100;
                    return <div className={`h-full ${pct === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${pct}%` }} />;
                 })()}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {selectedExercise && (
        <ExerciseModal 
          exercise={selectedExercise} 
          onClose={() => setSelectedExercise(null)} 
        />
      )}
    </div>
  );
};

// --- App Container / Authenticated View ---

const TrackerApp: React.FC<{ user: string; onLogout: () => void }> = ({ user, onLogout }) => {
  // State: Record<weekId, WeekProgress>
  // Keyed locally by user name to allow basic multi-user simulation
  const storageKey = `fitness_progress_${user}`;
  
  const [allProgress, setAllProgress] = useState<Record<string, WeekProgress>>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
    return {};
  });

  const [selectedWeek, setSelectedWeek] = useState<WeekDefinition | null>(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(allProgress));
  }, [allProgress, storageKey]);

  const toggleTask = (weekId: string, taskId: string) => {
    setAllProgress(prev => {
      const currentWeekProgress = prev[weekId] || {};
      return {
        ...prev,
        [weekId]: {
          ...currentWeekProgress,
          [taskId]: !currentWeekProgress[taskId]
        }
      };
    });
  };

  // Calculate Total Completed across ALL weeks
  const totalCompleted = React.useMemo(() => {
    let count = 0;
    Object.values(allProgress).forEach(weekProgress => {
      Object.values(weekProgress).forEach(isDone => {
        if (isDone) count++;
      });
    });
    return count;
  }, [allProgress]);

  if (selectedWeek) {
    // Find the month for this week to display title
    const month = MONTHS.find(m => m.weeks.some(w => w.id === selectedWeek.id));
    
    return (
      <WeekDetailView 
        week={selectedWeek}
        monthTitle={month?.title || 'Calendar'}
        progress={allProgress[selectedWeek.id] || {}}
        totalCompleted={totalCompleted}
        onToggle={(taskId) => toggleTask(selectedWeek.id, taskId)}
        onBack={() => setSelectedWeek(null)}
      />
    );
  }

  return (
    <MonthView 
      user={user}
      allProgress={allProgress}
      totalCompleted={totalCompleted}
      onSelectWeek={setSelectedWeek}
      onLogout={onLogout}
    />
  );
};

// --- Main App Root ---

const App: React.FC = () => {
  // Simple Session Management
  const [user, setUser] = useState<string | null>(() => {
    return localStorage.getItem('fitness_active_user');
  });

  const handleLogin = (username: string) => {
    localStorage.setItem('fitness_active_user', username);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('fitness_active_user');
    setUser(null);
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Use key={user} to ensure TrackerApp re-mounts and re-initializes state when user changes
  return <TrackerApp key={user} user={user} onLogout={handleLogout} />;
};

// --- Helper Components (Reusable) ---

const TaskRow: React.FC<{ task: TaskItem; isChecked: boolean; onToggle: () => void }> = ({ task, isChecked, onToggle }) => (
  <label className={`flex items-start gap-3 cursor-pointer group p-1 rounded hover:bg-black/5 transition-colors ${isChecked ? 'opacity-50' : ''}`}>
    <div className="relative flex items-center mt-0.5">
      <input 
        type="checkbox" 
        checked={isChecked} 
        onChange={onToggle}
        className="peer sr-only"
      />
      <div className={`w-4 h-4 border-2 rounded transition-colors ${isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'}`}>
         {isChecked && <svg className="w-3 h-3 text-white mx-auto mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
      </div>
    </div>
    <span className={`text-sm leading-tight transition-all ${isChecked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
      {task.text}
    </span>
  </label>
);

const WorkoutRow: React.FC<{ task: TaskItem; isChecked: boolean; onToggle: () => void; onShowDetails: () => void }> = ({ task, isChecked, onToggle, onShowDetails }) => {
  if (task.isSubHeader) {
    return (
      <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide pt-2 border-b border-indigo-100 pb-1 mb-1">
        {task.text}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between group p-1.5 rounded-md hover:bg-slate-50 transition-colors">
      <label className={`flex items-start gap-3 cursor-pointer flex-1 ${isChecked ? 'opacity-50' : ''}`}>
        <div className="relative flex items-center mt-1">
          <input 
            type="checkbox" 
            checked={isChecked} 
            onChange={onToggle}
            className="peer sr-only"
          />
          <div className={`w-5 h-5 border-2 rounded transition-colors ${isChecked ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 group-hover:border-indigo-400'}`}>
             {isChecked && <svg className="w-3.5 h-3.5 text-white mx-auto mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
          </div>
        </div>
        <span className={`text-sm font-medium leading-tight transition-all ${isChecked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
          {task.text}
        </span>
      </label>
      
      {task.exerciseName && (
        <button 
          onClick={(e) => { e.stopPropagation(); onShowDetails(); }}
          className="ml-2 text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-50"
          title="View Instructions"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </button>
      )}
    </div>
  );
};

export default App;
