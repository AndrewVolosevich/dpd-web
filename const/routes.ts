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
		items: [
			{
				title: 'История',
				href: `${Routes.ABOUT}/history`,
			},
			{
				title: 'Миссия и ценности ',
				href: `${Routes.ABOUT}/mission`,
			},
			{
				title: 'Орг.структура',
				href: `${Routes.ABOUT}/structure`,
			},
			{
				title: 'Первые лица DPD Беларусь',
				href: `${Routes.ABOUT}/head`,
			},
			{
				title: 'Реквизиты',
				href: `${Routes.ABOUT}/details`,
			},
		],
	},
	{
		title: 'База знаний',
		href: Routes.KNOWLEDGE_BASE,
	},
	{
		title: 'Корпоративная жизнь',
		href: Routes.CORPORATE_LIFE,
		items: [
			{
				title: 'Корпоративные журналы',
				href: `${Routes.CORPORATE_LIFE}/magazines`,
			},
			{
				title: 'Фото',
				href: `${Routes.CORPORATE_LIFE}/photo`,
			},
			{
				title: 'Видео',
				href: `${Routes.CORPORATE_LIFE}/video`,
			},
		],
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
