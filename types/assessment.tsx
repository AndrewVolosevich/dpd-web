import { CommentModel, UserData } from '@/types/entities';

export enum AssessmentType {
	FULL = 'FULL',
	SIMPLIFIED = 'SIMPLIFIED',
	NONE = 'NONE',
}

export enum AssessmentStatus {
	SELF_ASSESSMENT = 'SELF_ASSESSMENT',
	SUPERVISOR_ASSESSMENT = 'SUPERVISOR_ASSESSMENT',
	EMPLOYEE_ACKNOWLEDGEMENT = 'EMPLOYEE_ACKNOWLEDGEMENT',
	SUPERVISOR_CONCLUSION = 'SUPERVISOR_CONCLUSION',
	COMPLETED = 'COMPLETED',
}

export enum GoalType {
	PLANNED = 'PLANNED',
	REMOVED = 'REMOVED',
}

export interface CompetencyWithRatings {
	id?: string;
	title: string;
	employeeRating?: number;
	supervisorRating?: number;

	assessmentId?: string;
	assessment?: Assessment;
}

export interface Goal {
	id: string;
	title: string;
	result?: string;
	employeeRating?: number;
	supervisorRating?: number;
	type?: GoalType;
	dueDate?: string;

	assessmentLastYearId?: string;
	assessmentLastYear?: Assessment;

	assessmentNextYearId?: string;
	assessmentNextYear?: Assessment;
}

export interface AssessmentRecommendation {
	id: string;
	title: string;
	recommendation?: string;
	description: string;
}

export interface Assessment {
	id: string;
	year: number;
	userId: string;
	user?: UserData;
	type: AssessmentType;
	status: AssessmentStatus;

	goalsLastYear: Goal[];
	goalsNextYear: Goal[];

	commentsLastYear?: CommentModel[];
	commentsNextYear?: CommentModel[];
	commentsCompetencies?: CommentModel[];
	commentsMastery?: CommentModel[];

	competencies: CompetencyWithRatings[];
	mastery: CompetencyWithRatings[];
	recommendations?: AssessmentRecommendation[];

	averageCompetencyUser?: number;
	averageCompetencySupervisor?: number;
	averageLastYearUser?: number;
	averageLastYearSupervisor?: number;
	averageMasteryUser?: number;
	averageMasterySupervisor?: number;

	startDate?: string;
	dueDate?: string;

	createdAt?: string;
	updatedAt?: string;

	evaluator?: UserData;
}
