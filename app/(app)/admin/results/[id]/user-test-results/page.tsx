import UserTestResults from '@/components/pages/Admin/Results/UserTestResults';

interface UserResultsPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function UserResults(props: UserResultsPageProps) {
	const { id } = await props.params;
	return (
		<div className={'w-full'}>
			<UserTestResults surveyId={id} />
		</div>
	);
}
