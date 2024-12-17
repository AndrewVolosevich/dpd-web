import NewsPage from '@/components/pages/News/NewsPage';

interface NewsPageProps {
	params: Promise<{
		newsId: string;
	}>;
}

export default async function EditNews({ params }: NewsPageProps) {
	const { newsId } = await params;
	return <NewsPage newsId={newsId} isEdit />;
}
