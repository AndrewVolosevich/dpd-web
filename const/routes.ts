export enum Routes {
	HOME = '/',
	ABOUT = '/about',
	KNOWLEDGE_BASE = '/knowledge-base',
	CORPORATE_LIFE = '/corporate-life',
	NEWS = '/news',
	PROFILE = '/profile',
}

export const NavLinks = [
	{
		title: 'Главная',
		href: Routes.HOME,
	},
	{
		title: 'О компании',
		href: Routes.ABOUT,
	},
	{
		title: 'База знаний',
		href: Routes.KNOWLEDGE_BASE,
	},
	{
		title: 'Корпоративная жизнь',
		href: Routes.CORPORATE_LIFE,
	},
	{
		title: 'Новости',
		href: Routes.NEWS,
	},
	{
		title: 'Профиль',
		href: Routes.PROFILE,
	},
];

export const PROTECTED_ROUTES = [];
export const UNPROTECTED_ROUTES = [
	Routes.HOME,
	Routes.ABOUT,
	Routes.KNOWLEDGE_BASE,
	Routes.CORPORATE_LIFE,
	Routes.NEWS,
	Routes.PROFILE,
];
