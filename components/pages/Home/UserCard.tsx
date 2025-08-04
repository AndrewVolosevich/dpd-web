import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserData } from '@/types/entities';
import Link from 'next/link';
import { Pencil } from 'lucide-react';

type UserCardProps = React.HTMLAttributes<HTMLDivElement> & {
	user: UserData;
	full?: boolean;
	lg?: boolean;
	onEdit?: () => void;
};

const UserCard = ({ className, user, full, lg, onEdit }: UserCardProps) => {
	if (full) {
		return (
			<div className={cn('w-full overflow-hidden', className)}>
				<div
					className={cn('relative w-24 h-24 mx-auto mb-4', lg && 'w-36 h-36')}
				>
					<Avatar className={'w-full h-full'}>
						<AvatarImage
							src={user?.photo || '/placeholder.svg'}
							alt={user?.name}
						/>
						<AvatarFallback className="bg-muted text-2xl">
							{user?.name?.[0]?.toUpperCase() +
								user?.surname?.[0]?.toUpperCase()}
						</AvatarFallback>
					</Avatar>
					{!!onEdit && (
						<div
							className={
								'bg-white rounded-full border-1 p-2 absolute bottom-0 right-0 cursor-pointer'
							}
							onClick={onEdit}
						>
							<Pencil className={'text-primary h-5 w-5'} />
						</div>
					)}
				</div>
				<div
					className={'flex flex-col justify-center items-center w-full px-2'}
				>
					<Link
						href={`/profile/${user?.id}`}
						className={'text-center w-full block'}
					>
						<h3 className="font-medium text-base mb-1 text-primary truncate">
							{user?.name + ' ' + user?.surname}
						</h3>
						{user?.position && (
							<div className="text-sm text-muted-foreground line-clamp-2 break-words">
								{user?.position?.title}
							</div>
						)}
					</Link>
				</div>
			</div>
		);
	}
	return (
		<Link href={`profile/${user?.id}`}>
			<div className={cn('w-full flex flex-row justify-start mb-4', className)}>
				<Avatar className="w-12 h-12 mr-4">
					<AvatarImage src={user?.photo} alt={user?.name} />
					<AvatarFallback className="bg-muted">
						{user?.name?.[0]?.toUpperCase() + user?.surname?.[0]?.toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div
					className={cn(
						'flex flex-col items-center justify-start',
						!user?.position && 'justify-center',
					)}
				>
					<p className="text-sm block self-start font-bold text-primary">
						{user?.name + ' ' + user?.surname}
					</p>
					<p className="line-clamp-2 text-xs sm:text-sm text-gray-600 block">
						{user?.position?.title}
					</p>
				</div>
			</div>
		</Link>
	);
};

export default UserCard;
