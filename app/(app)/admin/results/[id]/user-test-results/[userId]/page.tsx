import UserTestResults from '@/components/pages/Admin/Results/UserTestResults';

interface UserResultsPageProps {
	params: Promise<{
		id: string;
		userId: string;
	}>;
}

export default async function UserResults(props: UserResultsPageProps) {
	const { id, userId } = await props.params;
	return (
		<div className={'w-full'}>
			<UserTestResults surveyId={id} userId={userId} />
		</div>
	);
}
