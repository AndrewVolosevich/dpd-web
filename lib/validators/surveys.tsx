import { Survey } from '@/types/entities';

export const validateSurvey = (surveyData: Survey) => {
	if (
		!surveyData?.title.length ||
		!surveyData.description?.length ||
		!surveyData?.questions?.length
	) {
		return false;
	}

	let isValid = true;

	surveyData.questions.forEach((q) => {
		if (!q.text?.length || !q.type) {
			isValid = false;
		}
		if (q?.type === 'SINGLE_CHOICE' || q?.type === 'MULTIPLE_CHOICE') {
			if (!q?.options?.length) {
				isValid = false;
			}
		}
		if (q?.type === 'RATING') {
			if (!q?.ratingConfig) {
				isValid = false;
			}
		}
	});

	return isValid;
};
