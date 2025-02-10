import React from 'react';

const PhotoPage = () => {
	return (
		<div className="flex-grow container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Корпоративные фото</h1>

			<section className="bg-white rounded-lg shadow p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4">Галерея</h2>
				<div className="mb-4">
					<h3 className="font-semibold mb-2">Фотоотчеты с мероприятий</h3>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
						{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
							<img
								key={i}
								src={`https://placehold.co/150x150`}
								alt={`Мероприятие ${i}`}
								className="w-full h-32 object-cover rounded"
							/>
						))}
					</div>
				</div>
			</section>
		</div>
	);
};

export default PhotoPage;
