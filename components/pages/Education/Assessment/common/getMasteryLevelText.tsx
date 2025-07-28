const getMasteryLevelText = (value?: number) => {
	switch (value) {
		case 0:
			return 'низкий уровень (новичок - 0)';
		case 1:
			return 'средний уровень (стандарт - 1)';
		case 2:
			return 'выше среднего уровня (профессионал - 2) ';
		case 3:
			return 'высокий уровень (эксперт - 3)';
		default:
			return 'не оценен';
	}
};

const getMasteryLevelRating = (value?: number) => {
	if (value === undefined || value === null) {
		return {
			title: 'Новичок',
			description:
				'Соответствует базовым требованиям, требует постоянного обучения и контроля (0-2)',
		};
	}

	if (value >= 0 && value <= 2) {
		return {
			title: 'Новичок',
			description:
				'Соответствует базовым требованиям, требует постоянного обучения и контроля (0-2)',
		};
	} else if (value >= 3 && value <= 6) {
		return {
			title: 'Стандарт',
			description: 'Уверенный в своих навыках, возможны ошибки в работе (3-6)',
		};
	} else if (value >= 7 && value <= 10) {
		return {
			title: 'Профессионал',
			description:
				'Высокий уровень навыков, лидер в команде, может обучать других; допускает минимальное количество ошибок (7-10)',
		};
	} else if (value >= 11 && value <= 12) {
		return {
			title: 'Эксперт',
			description:
				'Признанный эксперт, участвует в планировании и развитии направления (11-12)',
		};
	} else {
		return {
			title: 'Новичок',
			description:
				'Соответствует базовым требованиям, требует постоянного обучения и контроля (0-2)',
		};
	}
};

export { getMasteryLevelText, getMasteryLevelRating };
