import UpdateSurveyPage from '@/components/pages/Admin/Surveys/UpdateSurveyPage';

interface SurveyPageProps {
	params: Promise<{
		surveyId: string;
	}>;
}

export default async function Survey({ params }: SurveyPageProps) {
	const { surveyId } = await params;

	return (
		<div>
			<UpdateSurveyPage surveyId={surveyId} />
		</div>
	);
}
