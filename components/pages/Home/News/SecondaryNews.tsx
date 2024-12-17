import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SecondaryNews = () => {
	return (
		<Link href="/public">
			<div className="bg-white rounded shadow overflow-hidden pb-2">
				<div className={'w-full max-h-[200px] min-h-32 relative'}>
					<Image
						src="https://placehold.co/200x150"
						layout="fill"
						objectFit="cover"
						alt={`Secondary news`}
					/>
				</div>
				<div className={'line-clamp-3 px-2 pt-2'}>
					<p className="text-xs text-gray-600">
						Краткое содержание новости Краткое содержание новости Краткое
						содержание новости Краткое содержание новости Краткое содержание
						новости Краткое содержание новости Краткое содержание новости
						Краткое содержание новости Краткое содержание новости
					</p>
				</div>
			</div>
		</Link>
	);
};

export default SecondaryNews;
