import TestResultsPage from '@/components/pages/Admin/Results/TestResultsPage';

interface ResultsPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function TestResults(props: ResultsPageProps) {
	const id = (await props.params).id;
	return (
		<div className={'w-full'}>
			<TestResultsPage id={id} />
		</div>
	);
}
