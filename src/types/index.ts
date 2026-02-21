export type RatingValue = 'U' | 'N' | 'M' | 'E' | 'O';
export type PurserRating = 'N' | 'R' | 'A';
export type EvaluationStatus = 'Not Started' | 'In Progress' | 'Completed';
export type CrewRole = 'Cabin Crew' | 'Purser';

export interface CrewMember {
  id: string;
  name: string;
  photo: string;
  role: CrewRole;
  joinDate: string;
  contact: string;
  previousPerformance: 'excellent' | 'good' | 'average' | 'needs-improvement';
  evaluationStatus: EvaluationStatus;
  hasSafetyViolation: boolean; // New: Safety badge
  performanceData: PerformanceData[]; // New: Individual Radar Chart
  history: PastFlight[]; // New: Trend Line
}

export interface Flight {
  id: string;
  flightNumber: string;
  route: string;
  aircraft: string;
  date: string;
  crew: CrewMember[];
}

export interface CriterionRating {
  criterionId: string;
  rating: RatingValue | null;
  remarks: string;
}

export interface CategoryRatings {
  categoryId: string;
  criteria: CriterionRating[];
}

export interface CabinCrewEvaluation {
  crewMemberId: string;
  flightId: string;
  categories: CategoryRatings[];
  overallRemarks: string;
  evaluatorSignature: string;
  status: EvaluationStatus;
  overallScore: number | null;
  date: string;
}

export interface PurserCriterionRating {
  criterionId: string;
  rating: PurserRating | null;
  remarks: string;
  isSafetyCritical: boolean;
}

export interface PurserSectionRatings {
  sectionId: string;
  criteria: PurserCriterionRating[];
}

export interface PurserEvaluation {
  crewMemberId: string;
  flightId: string;
  sections: PurserSectionRatings[];
  remarks: {
    summary: string;
    strengths: string;
    development: string;
    actionPlan: string;
  };
  signatures: {
    purser: { name: string; date: string; signed: boolean };
    evaluator: { name: string; date: string; signed: boolean };
    manager: { name: string; date: string; signed: boolean };
  };
  status: EvaluationStatus;
  overallScore: number | null;
  date: string;
}

export interface PastFlight {
  id: string;
  date: string;
  flightNumber: string;
  route: string;
  crewMemberName: string;
  crewMemberId: string;
  role: CrewRole;
  overallScore: number;
  status: EvaluationStatus;
}

export interface PerformanceData {
  category: string;
  year2025: number;
  year2026: number;
  fullMark: 100;
}

export interface CabinCrewCategory {
  id: string;
  name: string;
  criteria: {
    id: string;
    name: string;
    weights: Record<RatingValue, number>;
  }[];
}

export interface PurserSection {
  id: string;
  name: string;
  items: {
    id: string;
    name: string;
    isSafetyCritical: boolean;
    detailedCriteria?: string;
  }[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'draft';
  plansCount: number;
  completedPlans: number;
  updatedAt: string;
  color: string;
}

export interface PlanTask {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  assignee?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Plan {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: 'draft' | 'in-progress' | 'completed';
  updatedAt: string;
  tasks: PlanTask[];
}
