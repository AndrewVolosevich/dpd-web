'use client';

import type React from 'react';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Calendar, User } from 'lucide-react';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { ThanksTo } from '@/types/content';

interface ThanksCardProps {
	thanks: ThanksTo;
	onEdit: () => void;
	onDelete: () => void;
}

export const ThanksCard: React.FC<ThanksCardProps> = ({
	thanks,
	onEdit,
	onDelete,
}) => {
	const { isAdmin } = useAuth();
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		});
	};

	return (
		<Card className="h-full flex flex-col">
			<CardHeader>
				<CardTitle className="text-lg">{thanks.title}</CardTitle>
				<div className="flex items-center gap-4 text-sm text-gray-500">
					<div className="flex items-center gap-1">
						<Calendar className="h-4 w-4" />
						{thanks?.createdAt && formatDate(thanks?.createdAt)}
					</div>
					<div className="flex items-center gap-1">
						<User className="h-4 w-4" />
						{thanks.from}
					</div>
				</div>
			</CardHeader>

			<CardContent className="flex flex-row flex-wrap justify-between items-start w-full">
				{!!thanks.imageUrl && (
					<div className="mb-4 w-[35%]">
						<img
							src={thanks.imageUrl || '/images/dpd-image.jpg'}
							alt="Благодарность"
							className="h-48 object-cover rounded-lg"
						/>
					</div>
				)}

				<div className="w-[60%] text-gray-700 text-sm leading-relaxed">
					{thanks.description}
				</div>
			</CardContent>

			{isAdmin && (
				<CardFooter className="flex gap-2 pt-4">
					<Button
						variant="outline"
						size="sm"
						onClick={onEdit}
						className="flex-1 bg-transparent"
					>
						<Edit className="mr-2 h-4 w-4" />
						Редактировать
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={onDelete}
						className="text-red-600 hover:text-red-700 bg-transparent"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</CardFooter>
			)}
		</Card>
	);
};
