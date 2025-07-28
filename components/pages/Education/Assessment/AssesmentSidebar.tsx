'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, BookOpen, Settings, Home } from 'lucide-react';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { Routes } from '@/const/routes';

const sidebarItems = [
	{
		title: 'Главная',
		href: `${Routes.EDUCATION}/assessment`,
		icon: Home,
	},
	{
		title: 'Форма оценки',
		href: `${Routes.EDUCATION}/assessment/form`,
		icon: ClipboardList,
	},
	// {
	// 	title: 'Компетенции',
	// 	href: `${Routes.EDUCATION}/assessment/competencies`,
	// 	icon: Target,
	// },
	{
		title: 'Материалы',
		href: `${Routes.EDUCATION}/assessment/materials`,
		icon: BookOpen,
	},
	{
		title: 'Администрирование',
		href: `${Routes.EDUCATION}/assessment/admin`,
		icon: Settings,
		isAdmin: true,
	},
];

interface AssessmentSidebarProps {
	className?: string;
}

export function AssessmentSidebar({ className }: AssessmentSidebarProps) {
	const pathname = usePathname();
	const { isAdmin } = useAuth();

	return (
		<div className={cn('w-64 border-l bg-background min-h-[78vh]', className)}>
			<div className="flex flex-col gap-1 p-4">
				<div className="mb-4">
					<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
						Ежегодная оценка
					</h3>
				</div>
				{sidebarItems
					.filter((item) => !item.isAdmin || (item.isAdmin && isAdmin))
					.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								'flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors',
								pathname === item.href
									? 'bg-muted font-medium'
									: 'text-muted-foreground hover:text-foreground',
							)}
						>
							<item.icon className="h-4 w-4" />
							<span>{item.title}</span>
						</Link>
					))}
			</div>
		</div>
	);
}
