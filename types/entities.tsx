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
	name: string;
	surname: string;
	patronymic?: string;

	roles?: string[];
	department?: string;
	position?: string;
	isSupervisor?: boolean;

	endDate?: string;
	startDate?: string;
	bornDate?: string;
	createdAt: string;
	updatedAt?: string;

	photo?: string;
	presentation?: any;
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
	| 'PHOTO';

export type RatingType = 'EMOTIONS' | 'STARS' | 'SCALE' | 'MATRIX';
export type SurveyType = 'ANONYMOUS' | 'PERSONALIZED';
export type SurveyStatus = 'ACTIVE' | 'COMPLETED' | 'DRAFT';

export interface Question {
	id?: string;
	type: QuestionType;
	text: string;
	options: { value: string; correct?: boolean }[];
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

export interface Response {
	id: string;
	surveyId: string;
	userId: string;
	createdAt: string;
	answers: Answer[];
}

export interface Survey {
	id?: string;
	title: string;
	description?: string;
	preface?: string;
	afterword?: string;
	endDate?: string;
	type: SurveyType;
	status: SurveyStatus;
	updatedAt?: string;
	createdAt?: string;
	questions: Question[];
	responses?: Response[];
	_count?: {
		responses?: number;
	};
}

export interface Answer {
	id: string;
	questionId: string;
	value?: any;
	comment?: string;
	createdAt?: string;
	responseId: string;
}
