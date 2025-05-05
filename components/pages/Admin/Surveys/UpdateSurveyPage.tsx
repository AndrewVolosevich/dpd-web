'use client';
import { SurveyForm } from '@/components/pages/Admin/Surveys/SurveyForm/SurveyForm';
import useSurvey from '@/lib/api/queries/Education/useSurvey';

export default function UpdateSurveyPage({
	surveyId,
	forCopy,
}: {
	surveyId?: string;
	forCopy?: boolean;
}) {
	const { data } = useSurvey(surveyId);
	if (!surveyId || !data) {
		return null;
	}

	return (
		<div>
			<SurveyForm forCopy={forCopy} initialData={data} />
		</div>
	);
}
