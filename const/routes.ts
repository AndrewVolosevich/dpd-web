export enum Routes {
	HOME = '/',
	ABOUT = '/about',
	CORPORATE_LIFE = '/corporate-life',
	NEWS = '/news',
	PROFILE = '/profile',
	SIGN_IN = '/sign-in',
	ADMIN = '/admin',
	EDUCATION = '/education',
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
		title: 'Новости',
		href: Routes.NEWS,
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
		title: 'База знаний',
		href: `${Routes.EDUCATION}/materials`,
	},
	{
		title: 'Администратор',
		href: `${Routes.ADMIN}/users`,
		items: [
			{
				title: 'Пользователи',
				href: `${Routes.ADMIN}/users`,
			},
			{
				title: 'Опросы и тесты',
				href: `${Routes.ADMIN}/surveys`,
			},
			{
				title: 'Должностная структура',
				href: `${Routes.ADMIN}/structure`,
			},
		],
	},
];

export const PROTECTED_ROUTES = [
	Routes.HOME,
	Routes.ABOUT,
	Routes.CORPORATE_LIFE,
	Routes.NEWS,
	Routes.PROFILE,
];
export const UNPROTECTED_ROUTES = [Routes.SIGN_IN];
