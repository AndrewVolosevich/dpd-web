import { AssessmentStatus } from '@/types/assessment';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Calendar, CheckCircle, Clock } from 'lucide-react';
import React from 'react';

export const getAssessmentStatusBadge = (status?: AssessmentStatus) => {
	switch (status) {
		case AssessmentStatus.COMPLETED:
			return (
				<Badge className="bg-green-500 hover:bg-green-600">
					<CheckCircle className="w-3 h-3 mr-1" />
					Завершено
				</Badge>
			);
		case AssessmentStatus.EMPLOYEE_ACKNOWLEDGEMENT:
			return (
				<Badge variant="secondary">
					<Clock className="w-3 h-3 mr-1" />
					Ознакомление
				</Badge>
			);
		case AssessmentStatus.SUPERVISOR_ASSESSMENT:
			return (
				<Badge variant="secondary">
					<AlertCircle className="w-3 h-3 mr-1" />
					Оценка руководителем
				</Badge>
			);
		case AssessmentStatus.SELF_ASSESSMENT:
			return (
				<Badge variant="secondary">
					<Calendar className="w-3 h-3 mr-1" />
					Самооценка
				</Badge>
			);
		default:
			return (
				<Badge variant="secondary">
					<Calendar className="w-3 h-3 mr-1" />
					Не задано
				</Badge>
			);
	}
};

export const getAssessmentStatusByStep = (step: number) => {
	switch (step) {
		case 4:
			return AssessmentStatus.COMPLETED;
		case 3:
			return AssessmentStatus.EMPLOYEE_ACKNOWLEDGEMENT;
		case 2:
			return AssessmentStatus.SUPERVISOR_ASSESSMENT;
		case 1:
			return AssessmentStatus.SELF_ASSESSMENT;
		default:
			return AssessmentStatus.SELF_ASSESSMENT;
	}
};
