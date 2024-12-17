'use client';
import { usePathname } from 'next/navigation';
import { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function NavLink({
	href,
	className,
	isDisabled,
	...rest
}: ComponentProps<typeof Link> & {
	isHighlighted?: boolean;
	isDisabled?: boolean;
}) {
	const pathname = usePathname();
	const isActive = pathname === href;

	return (
		<Link
			aria-current={isActive ? 'page' : undefined}
			className={cn(
				'text-gray-600 hover:text-red-600 px-2 block py-6 text-base transition-colors',
				isDisabled && 'pointer-events-none opacity-50',
				className,
			)}
			href={href}
			{...rest}
		/>
	);
}
