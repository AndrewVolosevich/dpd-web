import { CommentModel, LikeModel, UserData } from '@/types/entities';

export interface ContentPage {
	id?: string;
	pageTitle: string;
	content: any;

	createdAt?: string;
	updatedAt?: string;
}

export interface EmployeeInfoCard {
	id?: string;
	name: string;
	jobTitle?: string;
	content?: string;
	imgUrl?: string;
	isTop?: boolean;

	createdAt?: string;
	updatedAt?: string;
}

export interface TimeLine {
	id?: string;
	year: number;
	content: string[];

	createdAt?: string;
	updatedAt?: string;
}

export interface Nomination {
	id?: string;
	title: string;
	description?: string;
	nominants: UserData[];

	createdAt?: string;
	updatedAt?: string;
}

export interface EventPhoto {
	id?: string;
	title: string;
	urls: string[];
}

export interface CompanyVideo {
	id?: string;
	title: string;
	url?: string;
	link?: string;
}

export enum QuestionToDirectorStatus {
	APPROVED = 'APPROVED',
	MODERATION = 'MODERATION',
	REJECTED = 'REJECTED',
	ANSWERED = 'ANSWERED',
}

export interface QuestionToDirector {
	id: string;
	title: string;
	description: string;
	category: string;

	directorAnswer?: string;
	answeredAt?: string;

	userId: string;
	user?: UserData;

	comments?: CommentModel[];
	likes?: LikeModel[];

	status: QuestionToDirectorStatus;

	createdAt: string;
	updatedAt?: string;
}
