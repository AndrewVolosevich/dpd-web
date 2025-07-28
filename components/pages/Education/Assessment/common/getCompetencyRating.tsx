import { CompetencyWithRatings } from '@/types/assessment';

export const getCompetencyRating = (value?: number) => {
	switch (value) {
		case 0:
			return 'не проявлена (0)';
		case 1:
			return 'слабо проявлена (1)';
		case 2:
			return 'достаточный уровень развития (2)';
		case 3:
			return 'ярко выраженный уровень (3)';
		default:
			return 'не проявлена (0)';
	}
};

export const mergeAndSortCompetencies = (
	defaultCompetency: { title: string }[],
	existingCompetencies: { title: string; [key: string]: any }[],
) => {
	const existingMap = new Map(
		existingCompetencies.map((item) => [item.title, item]),
	);

	// Проходим по defaultCompetency, заменяя данные из existingCompetencies, если они существуют
	return defaultCompetency.map((defaultItem) =>
		existingMap.has(defaultItem.title)
			? existingMap.get(defaultItem.title)!
			: (defaultItem as CompetencyWithRatings),
	);
};

export const mergeAndSortMastery = (
	defaultMastery: { title: string }[],
	existingMastery: { title: string; [key: string]: any }[],
) => {
	const existingMap = new Map(
		existingMastery.map((item) => [item.title, item]),
	);

	// Проходим по defaultCompetency, заменяя данные из existingCompetencies, если они существуют
	return defaultMastery.map((defaultItem) =>
		existingMap.has(defaultItem.title)
			? existingMap.get(defaultItem.title)!
			: (defaultItem as CompetencyWithRatings),
	);
};
