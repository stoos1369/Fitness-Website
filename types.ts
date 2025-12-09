export enum TaskType {
  DIET = 'DIET',
  WORKOUT = 'WORKOUT',
  PROTEIN = 'PROTEIN',
  OTHER = 'OTHER'
}

export interface TaskItem {
  id: string;
  text: string;
  type: TaskType;
  exerciseName?: string; // If present, clicking triggers Gemini lookup
  isSubHeader?: boolean; // If true, it's just a label like "Upper Body"
}

export interface DaySchedule {
  id: string;
  dayName: string; // e.g., "Monday"
  title: string; // e.g., "Upper Body Strength"
  lunch?: TaskItem[];
  dinner?: TaskItem[];
  proteinGoal: string;
  workout?: TaskItem[];
}

export interface WeekProgress {
  [taskId: string]: boolean; // Map taskId to completed status
}

export interface WeekDefinition {
  id: string;
  title: string;
  dateRange: string;
}

export interface MonthDefinition {
  id: string; // e.g., "2025-12"
  title: string; // e.g., "December 2025"
  weeks: WeekDefinition[];
}
