import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const VideoPage = () => {
	return (
		<div className="flex-grow container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Корпоративные видео</h1>

			<section className="bg-white rounded-lg shadow p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4">Галерея</h2>
				<div>
					<h3 className="font-semibold mb-2">Видеоролики о жизни в компании</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						{[1, 2, 3].map((i) => (
							<div key={i} className="relative">
								<img
									src={`https://placehold.co/200x300`}
									alt={`Видео ${i}`}
									className="w-full h-40 object-cover rounded"
								/>
								<Button
									variant="secondary"
									size="icon"
									className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
								>
									<Play className="h-6 w-6" />
								</Button>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
};

export default VideoPage;
