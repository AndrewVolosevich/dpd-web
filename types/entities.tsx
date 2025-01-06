export type NewsModel = {
	content?: any;
	createdAt: string;
	description?: string;
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

	image?: string;
	presentation?: any;
}

export interface PaginatedUsers {
	data: UserData[];
	total: number;
	page: number;
	limit: number;
}
