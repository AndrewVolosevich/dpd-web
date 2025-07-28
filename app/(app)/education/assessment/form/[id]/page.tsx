import { AssessmentFormPage } from '@/components/pages/Education/Assessment/AssessmentFormPage';

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function Goal(props: PageProps) {
	const { id } = await props.params;
	return <AssessmentFormPage assessmentId={id} />;
}
