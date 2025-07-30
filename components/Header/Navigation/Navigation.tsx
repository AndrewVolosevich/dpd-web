'use client';

import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { NavLinks, Routes } from '@/const/routes';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, HelpCircle } from 'lucide-react';

export function Navigation({ className }: { className?: string }) {
	const { isAdmin } = useAuth();
	const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
	const navRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (navRef.current && !navRef.current.contains(event.target as Node)) {
				setOpenMenuIndex(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleMenuClick = (index: number, hasSubmenu: boolean) => {
		if (hasSubmenu) {
			// Toggle submenu
			setOpenMenuIndex(openMenuIndex === index ? null : index);
		} else {
			setOpenMenuIndex(null);
		}
	};

	const links = NavLinks.filter((link) => link.href !== Routes.PROFILE);
	return (
		<nav
			ref={navRef}
			className={cn(
				'container mx-auto flex flex-row justify-between',
				className,
			)}
		>
			<div className="group flex p-0">
				{links.map((link, index) => {
					if (link.title === 'Администратор' && !isAdmin) {
						return null;
					}
					return (
						<div key={index} className="relative">
							<div
								className={cn(
									'px-5 py-6 flex items-center gap-1.5 cursor-pointer transition-colors hover:text-primary',
									openMenuIndex === index && 'bg-gray-200',
								)}
								onClick={() =>
									handleMenuClick(index, Boolean(link.items?.length))
								}
							>
								{link.items?.length ? (
									<>
										<span className="font-medium">{link.title}</span>
										<ChevronDown
											className={cn(
												'h-4 w-4 transition-transform',
												openMenuIndex === index && 'transform rotate-180',
											)}
										/>
									</>
								) : (
									<Link href={link.href || '/'} className="block font-medium">
										{link.title}
									</Link>
								)}
							</div>

							{link?.items &&
								link?.items?.length > 0 &&
								openMenuIndex === index && (
									<div className="absolute left-0 top-full bg-white shadow-md min-w-[240px] z-50 rounded-sm">
										<div className="rounded-md border bg-popover shadow-md">
											<ul className="p-4 list-none grid gap-3 m-0">
												{link.items.map((item) => (
													<ListItem
														key={item.title}
														href={item.href}
														title={item.title}
														onClick={() => {
															setOpenMenuIndex(null);
														}}
													/>
												))}
											</ul>
										</div>
									</div>
								)}
						</div>
					);
				})}
			</div>
			<div className="p-2 flex justify-center">
				<Link
					href={`${Routes.CORPORATE_LIFE}/question-to-director`}
					className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 text-base font-medium min-w-[200px] lg:min-w-[280px] justify-between transition-colors duration-200 no-underline"
				>
					<div className="flex items-center gap-3">
						<HelpCircle className="w-6 h-6" />
						<span>Вопрос директору</span>
					</div>
					<div className="bg-white rounded-full p-1.5">
						<ArrowUpRight className="w-4 h-4 text-primary hover:brightness-90 transition-colors" />
					</div>
				</Link>
			</div>
		</nav>
	);
}

const ListItem = React.forwardRef<
	React.ElementRef<'a'>,
	React.ComponentPropsWithoutRef<'a'>
>(({ className, title, onClick, children, ...props }, ref) => {
	return (
		<Link href={props?.href || ''} {...props} ref={ref} onClick={onClick}>
			<div
				className={cn(
					'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
					className,
				)}
			>
				<div className="text-sm font-medium leading-none">{title}</div>
				<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
					{children}
				</p>
			</div>
		</Link>
	);
});

ListItem.displayName = 'ListItem';
