'use client';

import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { NavLinks, Routes } from '@/const/routes';
import { useAuth } from '@/components/providers/global/AuthProvider';

export function Navigation({ className }: { className?: string }) {
	const { isAdmin } = useAuth();
	const links = NavLinks.filter((link) => link.href !== Routes.PROFILE);
	return (
		<div className={className}>
			<NavigationMenu>
				<NavigationMenuList>
					{links.map((link) => {
						if (link.title === 'Администратор' && !isAdmin) {
							return null;
						}
						return (
							<NavigationMenuItem key={link.title}>
								<Link href={link.href}>
									<NavigationMenuTrigger withIcon={!!link?.items?.length}>
										{link.title}
									</NavigationMenuTrigger>
								</Link>
								{link?.items && link?.items?.length > 0 && (
									<NavigationMenuContent className={'relative'}>
										<ul className="p-6 list-none w-[80vw]">
											{link.items.map((item) => (
												<ListItem
													key={item.title}
													href={item.href}
													title={item.title}
												/>
											))}
										</ul>
									</NavigationMenuContent>
								)}
							</NavigationMenuItem>
						);
					})}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}

const ListItem = React.forwardRef<
	React.ElementRef<'a'>,
	React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
	return (
		<Link href={props?.href || ''} {...props} ref={ref}>
			<NavigationMenuLink asChild>
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
			</NavigationMenuLink>
		</Link>
	);
});

ListItem.displayName = 'ListItem';
