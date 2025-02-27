import TakeSurveyPage from '@/components/pages/Admin/Surveys/TakeSurvey/TakeSurveyPage';

interface SurveyPageProps {
	params: Promise<{
		surveyId: string;
	}>;
}

export default async function TakeSurvey({ params }: SurveyPageProps) {
	const { surveyId } = await params;

	return (
		<div className={'w-full'}>
			<TakeSurveyPage surveyId={surveyId} />
		</div>
	);
}
