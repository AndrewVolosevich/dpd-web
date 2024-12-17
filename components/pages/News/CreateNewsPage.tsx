'use client';
import dynamic from 'next/dynamic';

const NewsPage = dynamic(() => import('@/components/pages/News/NewsPage'), {
	ssr: false,
});

export default function CreateNewsPage() {
	return <NewsPage />;
}
