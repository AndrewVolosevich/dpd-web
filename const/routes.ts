export enum Routes {
	HOME = '/',
	ABOUT = '/about',
	CORPORATE_LIFE = '/corporate-life',
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
			{
				title: 'Справочник сотрудников',
				href: `${Routes.ABOUT}/users`,
			},
			{
				title: 'Карьера в DPD',
				href: `${Routes.ABOUT}/career`,
			},
		],
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
				title: 'Галерея',
				href: `${Routes.CORPORATE_LIFE}/gallery`,
			},
			{
				title: 'Лучшие сотрудники',
				href: `${Routes.CORPORATE_LIFE}/best-employees`,
			},
			{
				title: 'Благодарности',
				href: `${Routes.CORPORATE_LIFE}/thanks`,
			},
			{
				title: 'Новости',
				href: `${Routes.CORPORATE_LIFE}/news`,
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
		title: 'Обучение и развитие',
		href: `${Routes.EDUCATION}/materials`,
	},
	{
		title: 'Администратор',
		href: `${Routes.ADMIN}/structure`,
		items: [
			{
				title: 'Должностная структура',
				href: `${Routes.ADMIN}/structure`,
			},
			{
				title: 'Опросы и тесты',
				href: `${Routes.ADMIN}/surveys`,
			},
		],
	},
];

export const PROTECTED_ROUTES = [
	Routes.HOME,
	Routes.ABOUT,
	Routes.CORPORATE_LIFE,
	Routes.PROFILE,
];
export const UNPROTECTED_ROUTES = [Routes.SIGN_IN];
