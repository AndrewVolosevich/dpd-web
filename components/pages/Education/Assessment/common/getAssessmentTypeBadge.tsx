import { AssessmentType } from '@/types/assessment';
import { Badge } from '@/components/ui/badge';

export const getAssessmentTypeBadge = (type?: string) => {
	switch (type) {
		case AssessmentType.FULL:
			return <Badge variant="secondary">Полная оценка</Badge>;
		case AssessmentType.SIMPLIFIED:
			return <Badge variant="secondary">Упрощенная оценка</Badge>;
		case AssessmentType.NONE:
			return <Badge variant="secondary">Не назначена</Badge>;
		default:
			return <Badge variant="secondary">Не назначена</Badge>;
	}
};
