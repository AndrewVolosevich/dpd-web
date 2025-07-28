import { AssessmentType } from '@/types/assessment';

const getAssessmentStatusText = (type?: AssessmentType) => {
	switch (type) {
		case AssessmentType.FULL:
			return 'Полная';
		case AssessmentType.SIMPLIFIED:
			return 'Упрощенная';
		case AssessmentType.NONE:
			return 'Не задан';
		default:
			return 'не задан';
	}
};

export default getAssessmentStatusText;
