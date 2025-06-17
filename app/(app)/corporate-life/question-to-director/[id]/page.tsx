import DirectorQuestionPage from '@/components/pages/CorporateLife/AskDirector/DirectorQuestionPage';

interface DirectorQuestionProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function DirectorQuestion({
	params,
}: DirectorQuestionProps) {
	const innerParams = await params;
	return (
		<div>
			<DirectorQuestionPage id={innerParams.id} />
		</div>
	);
}
