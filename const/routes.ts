export enum Routes {
	HOME = '/',
	ABOUT = '/about',
	KNOWLEDGE_BASE = '/knowledge-base',
	CORPORATE_LIFE = '/corporate-life',
	NEWS = '/news',
	PROFILE = '/profile',
	SIGN_IN = '/sign-in',
	USERS = '/users',
}

export const NavLinks = [
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
		title: 'Пользователи',
		href: Routes.USERS,
	},
];

export const PROTECTED_ROUTES = [
	Routes.HOME,
	Routes.ABOUT,
	Routes.KNOWLEDGE_BASE,
	Routes.CORPORATE_LIFE,
	Routes.NEWS,
	Routes.PROFILE,
];
export const UNPROTECTED_ROUTES = [Routes.SIGN_IN];
