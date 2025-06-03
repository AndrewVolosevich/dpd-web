'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	Book,
	BookOpen,
	FileText,
	GraduationCap,
	LineChart,
	UserPlus,
	Users,
} from 'lucide-react';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { Routes } from '@/const/routes';

const sidebarItems = [
	{
		title: 'Новому сотруднику',
		href: `${Routes.EDUCATION}/new-employee`,
		icon: UserPlus,
	},
	{
		title: 'Учебные кабинеты',
		href: `${Routes.EDUCATION}/materials`,
		icon: FileText,
	},
	{
		title: 'Материалы для саморазвития',
		href: `${Routes.EDUCATION}/self-development`,
		icon: Book,
	},
	{
		title: 'Мое обучение',
		href: `${Routes.EDUCATION}/my-training`,
		icon: GraduationCap,
	},
	{
		title: 'Адаптация',
		href: `${Routes.EDUCATION}/adaptation`,
		icon: BookOpen,
	},
	{
		title: 'Ежегодная оценка',
		href: `${Routes.EDUCATION}/assessment`,
		icon: LineChart,
	},
	{
		title: 'Панель руководителя',
		href: `${Routes.EDUCATION}/supervisor-panel`,
		icon: Users,
		isSupervisor: true,
	},
];

interface EducationSidebarProps {
	className?: string;
}

export function EducationSidebar({ className }: EducationSidebarProps) {
	const pathname = usePathname();
	const { isSupervisor } = useAuth();

	return (
		<div
			className={cn(
				'max-w-64 border-r h-[calc(100vh-250px)] bg-background',
				className,
			)}
		>
			<div className="flex flex-col gap-1 p-4">
				{sidebarItems
					.filter(
						(item) => !item.isSupervisor || (item.isSupervisor && isSupervisor),
					)
					.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								'flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors',
								pathname.startsWith(item.href)
									? 'bg-muted font-medium'
									: 'text-muted-foreground',
							)}
						>
							<item.icon className="h-4 w-4 flex-shrink-0" />
							<span className={'hidden sm:block'}>{item.title}</span>
						</Link>
					))}
			</div>
		</div>
	);
}
