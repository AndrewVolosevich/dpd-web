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
}

export interface EventPhoto {
	id?: string;
	title: string;
	urls: string[];
}
