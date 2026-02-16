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
  overallRemarks: string;
  evaluatorSignature: string;
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
