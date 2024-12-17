import React from 'react';
import { Button } from '@/components/ui/button';
import { CircleUserRound } from 'lucide-react';
import { Routes } from '@/const/routes';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type ProfileBtnProps = React.HTMLAttributes<HTMLElement>;

const ProfileBtn = ({ className }: ProfileBtnProps) => {
	const router = useRouter();
	return (
		<Button
			variant={'default'}
			href={`${Routes.PROFILE}`}
			className={cn('px-4 py-2 h-auto w-auto', className)}
			onClick={() => {
				router.push(Routes.PROFILE);
			}}
		>
			<CircleUserRound className="h-6 w-6 mr-2" />
			Личный кабинет
		</Button>
	);
};

export { ProfileBtn };
