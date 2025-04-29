import { Survey } from '@/types/entities';

export type MaterialType =
	| 'document'
	| 'presentation'
	| 'video'
	| 'audio'
	| 'webinar'
	| 'other';

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

export interface Assignment {
	assignedBy: string;
	completedAt?: string;
	createdAt: string;
	dueDate: string;
	id: string;
	material: TrainingMaterial;
	materialId: string;
	survey: Survey;
	surveyId: string;
	updatedAt: string;
	userPanelId: string;
}
