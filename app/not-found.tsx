import Link from 'next/link';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
	return (
		<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
			<div className="container flex flex-col items-center justify-center max-w-md text-center px-4">
				<div className="mb-8">
					<Package className="h-24 w-24 text-red-600 mx-auto" />
				</div>
				<h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
				<h2 className="text-2xl font-semibold text-gray-700 mb-4">
					Страница не найдена
				</h2>
				<p className="text-gray-600 mb-8">
					Извините, но страница, которую вы ищете, не существует или была
					перемещена
				</p>
				<Button asChild className="bg-red-600 hover:bg-red-700">
					<Link href="/">Вернуться на главную</Link>
				</Button>
			</div>
		</div>
	);
}
