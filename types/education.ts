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
	url: string;
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
