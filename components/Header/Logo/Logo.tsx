import React from 'react';
import { LogoIcon } from '@/components/pages/Home/LogoIcon';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Routes } from '@/const/routes';

type LogoProps = React.HTMLAttributes<HTMLElement>;

const Logo = ({ className }: LogoProps) => {
	return (
		<Link
			href={Routes.HOME}
			className={cn('flex items-center self-start', className)}
		>
			<LogoIcon />
			<span className="text-xl md:text-2xl ml-4">Корпоративный портал</span>
		</Link>
	);
};

export { Logo };
