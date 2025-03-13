import ResultsPage from '@/components/pages/Admin/Results/ResultsPage';

interface ResultsPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function Results(props: ResultsPageProps) {
	const id = (await props.params).id;
	return (
		<div className={'w-full'}>
			<ResultsPage id={id} />
		</div>
	);
}
