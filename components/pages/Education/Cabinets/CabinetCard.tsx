import Image from 'next/image';
import Link from 'next/link';
import { Routes } from '@/const/routes';

interface CabinetCardProps {
	id: string;
	title: string;
	imageUrl?: string;
}

export const CabinetCard = ({ id, title, imageUrl }: CabinetCardProps) => {
	return (
		<Link
			href={`${Routes.EDUCATION}/materials/cabinet/${id}`}
			className="block"
		>
			<div className="bg-gray-200 rounded overflow-hidden hover:shadow-md transition-shadow">
				<div className="h-40 relative">
					<Image
						src={imageUrl || '/placeholder.svg?height=160&width=300'}
						alt={title}
						fill
						className="object-cover"
					/>
				</div>
				<div className="p-4 bg-gray-100">
					<h2 className="text-gray-800 font-medium">{title}</h2>
				</div>
			</div>
		</Link>
	);
};
