export interface ContentPage {
	id?: string;
	pageTitle: string;
	content: any;

	createdAt?: string;
	updatedAt?: string;
}

export interface TopOfficial {
	id?: string;
	name: string;
	jobTitle?: string;
	content?: string;
	imgUrl?: string;

	createdAt?: string;
	updatedAt?: string;
}

export interface TimeLine {
	id?: string;
	year: number;
	content: string[];
}
