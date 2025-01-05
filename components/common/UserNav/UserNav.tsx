import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { useRouter } from 'next/navigation';
import { Routes } from '@/const/routes';
import React from 'react';

interface UserNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserNav({ className }: UserNavProps) {
	const router = useRouter();
	const { user, logout } = useAuth();
	return (
		<div className={className}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="relative h-8 w-8 rounded-full">
						<Avatar className="h-8 w-8">
							<AvatarImage src="/avatars/01.png" alt="@shadcn" />
							<AvatarFallback>
								{user
									? `${user?.name?.[0]?.toUpperCase()}${user?.surname?.[0]?.toUpperCase()}`
									: ''}
							</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">{`${user?.name} ${user?.surname}`}</p>
							<p className="text-xs leading-none text-muted-foreground">
								{user?.tel}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem
							onClick={() => {
								router.push(Routes.PROFILE);
							}}
						>
							Профиль
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={logout}>Выйти</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
