import UpdateSurveyPage from '@/components/pages/Admin/Surveys/UpdateSurveyPage';

interface SurveyPageProps {
	params: Promise<{
		surveyId: string;
	}>;
}

export default async function CopySurvey({ params }: SurveyPageProps) {
	const { surveyId } = await params;

	return (
		<div>
			<UpdateSurveyPage forCopy surveyId={surveyId} />
		</div>
	);
}
