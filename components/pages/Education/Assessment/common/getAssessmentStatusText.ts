import { AssessmentStatus } from '@/types/assessment';

const getAssessmentStatusText = (status?: AssessmentStatus) => {
	switch (status) {
		case AssessmentStatus.SELF_ASSESSMENT:
			return 'Самооценка';
		case AssessmentStatus.SUPERVISOR_ASSESSMENT:
			return 'Оценка руководителя';
		case AssessmentStatus.EMPLOYEE_ACKNOWLEDGEMENT:
			return 'Ознакомление';
		case AssessmentStatus.COMPLETED:
			return 'Завершена';
		default:
			return 'не задано';
	}
};

export default getAssessmentStatusText;
