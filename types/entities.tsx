import { Department, Position } from '@/types/structure';
import { ExtendedAssignment, UserPanel } from '@/types/education';

export type NewsModel = {
	content?: any;
	createdAt: string;
	description?: string;
	titleImg?: string;
	id: string;
	title?: string;
	updatedAt: string;
	userId: string;
	isMain: boolean;
};

export interface PaginatedNews {
	data: NewsModel[];
	total: number;
	main?: NewsModel;
	page: number;
	limit: number;
}

export interface UserData {
	tel: string;
	id: string;
	internalPhone?: string;
	phone?: string;
	email?: string;
	badge: string;

	name: string;
	surname: string;
	patronymic?: string;

	roles?: string[];
	department?: Department;
	departmentId?: string;
	position?: Position;
	positionId?: string;
	userPanelId?: string;

	endDate?: string;
	startDate?: string;
	bornDate?: string;
	createdAt: string;
	updatedAt?: string;

	photo?: string;
	presentation?: any;
}

export interface ExtendedUserData extends UserData {
	userPanel: UserPanel;
}

export interface PaginatedUsers {
	data: UserData[];
	total: number;
	page: number;
	limit: number;
}

export interface MagazineModel {
	id: string;
	title: string;
	titleImg?: string;
	contentUrl: string;
	updatedAt: string;
	createdAt: string;
}

export type MagazinesData = MagazineModel[];

// Surveys
export type QuestionType =
	| 'OPEN_TEXT'
	| 'SINGLE_CHOICE'
	| 'MULTIPLE_CHOICE'
	| 'RATING'
	| 'MATRIX'
	| 'PHOTO'
	| 'ORDERING';

export type RatingType = 'EMOTIONS' | 'STARS' | 'SCALE' | 'MATRIX';
export type SurveyType = 'ANONYMOUS' | 'PERSONALIZED';
export type SurveyVariant = 'SURVEY' | 'TEST';
export type SurveyStatus = 'ACTIVE' | 'COMPLETED' | 'DRAFT';

export interface Question {
	id?: string;
	type: QuestionType;
	text: string;
	options: { value: string; correct?: boolean; correctOrder?: number }[];
	isRequired: boolean;
	allowComment?: boolean;
	ratingConfig?: {
		type: RatingType;
		maxValue?: number;
		leftLabel?: string;
		rightLabel?: string;
		rows?: string[];
		columns?: string[];
	};
	photos?: { url: string }[];
	allowMultipleSelection?: boolean;
	answers?: Answer[];
}

export interface SurveyResponse {
	id: string;
	surveyId: string;
	userId: string;
	user?: {
		name?: string;
		surname?: string;
	};

	createdAt: string;
	answers: Answer[];
}

export interface SurveyTestResponse extends SurveyResponse {
	testResults?: {
		correctAnswers: number;
		passed: boolean;
		score: number;
		totalQuestions: number;
	};
}

export interface Survey {
	id: string;
	title: string;
	description?: string;
	preface?: string;
	showForAll?: boolean;
	afterword?: string;
	endDate?: string;
	type: SurveyType;
	status: SurveyStatus;
	surveyVariant?: SurveyVariant;
	updatedAt?: string;
	createdAt?: string;
	questions: Question[];
	responses?: SurveyTestResponse[];
	_count?: {
		responses?: number;
	};
	assignments?: SurveyAssignment[]; // Added assignments
	assignedUserIds?: string[]; // Added for form handling
}

export interface Answer {
	id: string;
	questionId: string;
	value?: any;
	comment?: string;
	createdAt?: string;
	responseId: string;
}

export interface SurveyAssignment {
	id: string;
	surveyId: string;
	userId: string;
	user?: UserData;
	createdAt: string;
	updatedAt: string;
}
