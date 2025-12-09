import { DaySchedule, TaskType, MonthDefinition, WeekDefinition } from './types';

// --- Gamification Data ---
export interface Achievement {
  threshold: number;
  title: string;
  icon: string; // Emoji or simple graphic representation
  message: string;
  insight: string; // The real-world meaning of this milestone (muscle, time, etc.)
  colorFrom: string;
  colorTo: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { 
    threshold: 0, 
    title: 'Novice Starter', 
    icon: '🌱', 
    message: 'Every journey begins with a single step.', 
    insight: 'The starting line. 100% intention set.',
    colorFrom: 'from-emerald-400', 
    colorTo: 'to-emerald-600' 
  },
  { 
    threshold: 15, 
    title: 'Momentum Builder', 
    icon: '🔥', 
    message: 'You are heating up! Keep the streak alive.', 
    insight: 'Approx. 2 weeks consistent. Nervous system is adapting; you feel stronger.',
    colorFrom: 'from-orange-400', 
    colorTo: 'to-red-500' 
  },
  { 
    threshold: 40, 
    title: 'Routine Ranger', 
    icon: '🧭', 
    message: 'Fitness is becoming your second nature.', 
    insight: 'Approx. 1 month. Posture improving, early metabolism boost.',
    colorFrom: 'from-blue-400', 
    colorTo: 'to-indigo-500' 
  },
  { 
    threshold: 80, 
    title: 'Iron Discipline', 
    icon: '🛡️', 
    message: 'Your consistency is your strongest armor.', 
    insight: 'Approx. 2-3 months. Visible muscle definition starting to appear.',
    colorFrom: 'from-indigo-500', 
    colorTo: 'to-purple-600' 
  },
  { 
    threshold: 150, 
    title: 'Fitness Warrior', 
    icon: '⚔️', 
    message: 'Crushing goals like a true warrior.', 
    insight: 'Approx. 4-5 months. Est. 0.5kg+ lean muscle gained. Clothes fit better.',
    colorFrom: 'from-purple-500', 
    colorTo: 'to-pink-600' 
  },
  { 
    threshold: 300, 
    title: 'Titan', 
    icon: '⚡', 
    message: 'You have reached godlike performance.', 
    insight: 'Approx. 8-10 months. Significant strength gains above average.',
    colorFrom: 'from-yellow-400', 
    colorTo: 'to-amber-600' 
  },
  { 
    threshold: 500, 
    title: 'Legendary', 
    icon: '👑', 
    message: 'Simply unmatched. A true legend.', 
    insight: '1+ Year. Complete lifestyle transformation. Elite consistency.',
    colorFrom: 'from-rose-500', 
    colorTo: 'to-red-700' 
  }
];

// Helper to generate weeks for a specific month and year
const generateMonthWeeks = (year: number, monthIndex: number): WeekDefinition[] => {
  // monthIndex: 0 = Jan, 11 = Dec
  const monthName = new Date(year, monthIndex).toLocaleString('en-US', { month: 'long' });
  const monthId = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
  
  // Create 4 standard weeks (1-7, 8-14, 15-21, 22-28)
  return [
    { id: `${monthId}-w1`, title: 'Week 1', dateRange: `${monthIndex + 1}/1 – ${monthIndex + 1}/7` },
    { id: `${monthId}-w2`, title: 'Week 2', dateRange: `${monthIndex + 1}/8 – ${monthIndex + 1}/14` },
    { id: `${monthId}-w3`, title: 'Week 3', dateRange: `${monthIndex + 1}/15 – ${monthIndex + 1}/21` },
    { id: `${monthId}-w4`, title: 'Week 4', dateRange: `${monthIndex + 1}/22 – ${monthIndex + 1}/28` },
  ];
};

// Generate range: December 2025 through December 2026
const generateCalendar = (): MonthDefinition[] => {
  const months: MonthDefinition[] = [];
  
  // Start: December 2025 (Year 2025, Month 11)
  // End: December 2026 (Year 2026, Month 11)
  // Total 13 months
  
  let currentYear = 2025;
  let currentMonth = 11; // Dec

  for (let i = 0; i < 13; i++) {
    const monthName = new Date(currentYear, currentMonth).toLocaleString('en-US', { month: 'long' });
    const fullTitle = `${monthName} ${currentYear}`;
    const id = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    
    months.push({
      id,
      title: fullTitle,
      weeks: generateMonthWeeks(currentYear, currentMonth)
    });

    // Increment month
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  }

  return months;
};

export const MONTHS: MonthDefinition[] = generateCalendar();

export const WEEKLY_SCHEDULE: DaySchedule[] = [
  {
    id: 'mon',
    dayName: '週一 (Mon)',
    title: '上半身肌力日 (Upper Body Strength)',
    lunch: [
      { id: 'm-l-1', text: '高蛋白主菜（雞腿/雞胸）', type: TaskType.DIET },
      { id: 'm-l-2', text: '飯至少半碗', type: TaskType.DIET },
      { id: 'm-l-3', text: '補 1 顆蛋/豆干（必要時）', type: TaskType.DIET },
    ],
    dinner: [
      { id: 'm-d-1', text: '高蛋白主菜 30–35g', type: TaskType.DIET },
      { id: 'm-d-2', text: '澱粉至少一份', type: TaskType.DIET },
    ],
    proteinGoal: '90–100g',
    workout: [
      { id: 'm-w-header', text: '彈力帶上半身（20–25 分）', type: TaskType.WORKOUT, isSubHeader: true },
      { id: 'm-w-1', text: '划船 (Row) 3×12–15', type: TaskType.WORKOUT, exerciseName: 'Resistance Band Row' },
      { id: 'm-w-2', text: '胸推 (Chest Press) 3×12–15', type: TaskType.WORKOUT, exerciseName: 'Resistance Band Chest Press' },
      { id: 'm-w-3', text: '肩推 (Shoulder Press) 2–3×10–12', type: TaskType.WORKOUT, exerciseName: 'Resistance Band Shoulder Press' },
      { id: 'm-w-4', text: '二頭彎舉 (Bicep Curl) 2×12–15', type: TaskType.WORKOUT, exerciseName: 'Resistance Band Bicep Curl' },
      { id: 'm-w-5', text: '三頭伸展 (Tricep Ext) 2×12–15', type: TaskType.WORKOUT, exerciseName: 'Resistance Band Tricep Extension' },
    ],
  },
  {
    id: 'tue',
    dayName: '週二 (Tue)',
    title: '休息／走路 (Rest/Walk)',
    lunch: [],
    dinner: [],
    proteinGoal: '-',
    workout: [
      { id: 't-w-1', text: '伸展 5 分鐘（可略）', type: TaskType.WORKOUT, exerciseName: 'Full Body Stretching' },
    ],
  },
  {
    id: 'wed',
    dayName: '週三 (Wed)',
    title: '下半身肌力日 (Lower Body Strength)',
    lunch: [
      { id: 'w-l-1', text: '高蛋白便當（目標 30g）', type: TaskType.DIET },
      { id: 'w-l-2', text: '飯至少半碗', type: TaskType.DIET },
    ],
    dinner: [
      { id: 'w-d-1', text: '高蛋白主菜＋澱粉', type: TaskType.DIET },
    ],
    proteinGoal: '90–100g',
    workout: [
      { id: 'w-w-header', text: '彈力帶下半身（20–25 分）', type: TaskType.WORKOUT, isSubHeader: true },
      { id: 'w-w-1', text: '深蹲 (Squat) 3×15', type: TaskType.WORKOUT, exerciseName: 'Resistance Band Squat' },
      { id: 'w-w-2', text: '弓箭步 (Lunge) 3×12/側', type: TaskType.WORKOUT, exerciseName: 'Resistance Band Lunge' },
      { id: 'w-w-3', text: '側步走 (Side Walk) 3×20 步', type: TaskType.WORKOUT, exerciseName: 'Resistance Band Side Walk' },
      { id: 'w-w-4', text: '彈力帶硬舉 (Deadlift) 3×12–15', type: TaskType.WORKOUT, exerciseName: 'Resistance Band Deadlift' },
      { id: 'w-w-5', text: '臀橋 (Glute Bridge) 3×15', type: TaskType.WORKOUT, exerciseName: 'Glute Bridge' },
    ],
  },
  {
    id: 'thu',
    dayName: '週四 (Thu)',
    title: '全身日 (Full Body)',
    lunch: [
      { id: 'th-l-1', text: '高蛋白便當', type: TaskType.DIET },
    ],
    dinner: [
      { id: 'th-d-1', text: '高蛋白主菜＋澱粉', type: TaskType.DIET },
    ],
    proteinGoal: '90–100g',
    workout: [
      { id: 'th-w-header', text: '彈力帶全身（20–25 分）', type: TaskType.WORKOUT, isSubHeader: true },
      { id: 'th-w-1', text: '下拉 (Lat Pulldown) 3×12–15', type: TaskType.WORKOUT, exerciseName: 'Resistance Band Lat Pulldown' },
      { id: 'th-w-2', text: '胸飛鳥 (Fly) 3×12–15', type: TaskType.WORKOUT, exerciseName: 'Resistance Band Chest Fly' },
      { id: 'th-w-3', text: '深蹲＋肩推 (Thruster) 3×10–12', type: TaskType.WORKOUT, exerciseName: 'Resistance Band Thruster' },
      { id: 'th-w-4', text: '捲腹 (Crunch) 3×12', type: TaskType.WORKOUT, exerciseName: 'Crunch' },
      { id: 'th-w-5', text: '平板 (Plank) 30–45 秒×2', type: TaskType.WORKOUT, exerciseName: 'Plank' },
    ],
  },
  {
    id: 'fri',
    dayName: '週五 (Fri)',
    title: '休息／走路 (Rest/Walk)',
    lunch: [],
    dinner: [],
    proteinGoal: '-',
    workout: [
      { id: 'f-w-1', text: '伸展 5 分鐘（可略）', type: TaskType.WORKOUT, exerciseName: 'Stretching' },
    ],
  },
  {
    id: 'sat',
    dayName: '週六 (Sat)',
    title: '恢復日 (Recovery)',
    lunch: [
      { id: 'sa-l-1', text: '高蛋白便當', type: TaskType.DIET },
    ],
    dinner: [
      { id: 'sa-d-1', text: '高蛋白主菜', type: TaskType.DIET },
    ],
    proteinGoal: '90g',
    workout: [
      { id: 'sa-w-header', text: '恢復訓練（選一 10–15 分）', type: TaskType.WORKOUT, isSubHeader: true },
      { id: 'sa-w-1', text: '基礎瑜珈 10 分', type: TaskType.WORKOUT, exerciseName: 'Basic Yoga Flow' },
      { id: 'sa-w-2', text: '彈力帶伸展 10 分', type: TaskType.WORKOUT, exerciseName: 'Resistance Band Stretching' },
      { id: 'sa-w-3', text: '輕度徒手循環', type: TaskType.WORKOUT, exerciseName: 'Light Bodyweight Circuit' },
    ],
  },
  {
    id: 'sun',
    dayName: '週日 (Sun)',
    title: '恢復日／自由日 (Free/Recovery)',
    lunch: [
      { id: 'su-l-1', text: '高蛋白便當', type: TaskType.DIET },
    ],
    dinner: [
      { id: 'su-d-1', text: '高蛋白主菜', type: TaskType.DIET },
    ],
    proteinGoal: '90g',
    workout: [
      { id: 'su-w-header', text: '輕鬆日', type: TaskType.WORKOUT, isSubHeader: true },
      { id: 'su-w-1', text: '走路 / 伸展 / 休息', type: TaskType.WORKOUT },
    ],
  },
];
