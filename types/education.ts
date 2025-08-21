import { Survey } from '@/types/entities';

export type MaterialType =
	| 'document'
	| 'presentation'
	| 'video'
	| 'audio'
	| 'webinar'
	| 'other';

export enum AdaptationStatus {
	ASSIGNED = 'ASSIGNED',
	ACKNOWLEDGED = 'ACKNOWLEDGED',
	ASSESSMENT = 'ASSESSMENT',
	COMPLETED = 'COMPLETED',
}

export interface TrainingMaterial {
	id: string;
	title: string;
	type: MaterialType;
	url?: string;
	fileUrl?: string;
	createdAt: string;
	updatedAt: string;

	sectionId: string;
}

export interface TrainingSection {
	id: string;
	title: string;
	materials: TrainingMaterial[];
	createdAt: string;
	updatedAt: string;

	cabinetId: string;
}

export interface TrainingCabinet {
	id: string;
	title: string;
	sections?: TrainingSection[];
	imageUrl?: string;

	createdAt?: string;
	updatedAt?: string;
}

export interface AdaptationPlan {
	id: string;
	fileUrl: string;
	supervisorComment: string;
	status: AdaptationStatus;

	createdAt?: string;
	updatedAt?: string;
	assignmentId?: string;
}

export interface Assignment {
	assignedBy: string;
	completedAt?: string;
	createdAt: string;
	startDate?: string;
	dueDate?: string;
	id: string;
	material: TrainingMaterial;
	materialId: string;
	survey: Survey;
	surveyId: string;
	adaptationPlan?: AdaptationPlan;
	adaptationPlanId?: string;
	updatedAt: string;
	userPanelId: string;
}

export interface ExtendedSurvey extends Survey {
	testResults: {
		correctAnswers?: number;
		passed?: boolean;
		score?: number;
		totalQuestions?: number;
	};
}

export interface ExtendedAssignment extends Assignment {
	survey: ExtendedSurvey;
}

export interface UserPanel {
	createdAt: string;
	id: string;
	updatedAt: string;
	userId: string;
	assignments: ExtendedAssignment[];
}
