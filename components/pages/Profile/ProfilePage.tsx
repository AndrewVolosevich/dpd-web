'use client';
import React, { useMemo, useState } from 'react';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Building, Calendar, Edit2, Mail, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import UserCard from '@/components/pages/Home/UserCard';
import FullPageLoader from '@/components/common/Loader/FullPageLoader';
import EditUserModal from '@/components/pages/Profile/EditUserModal';
import { format } from 'date-fns';
import { UserData } from '@/types/entities';
import Presentation from '@/components/pages/Profile/Presentation';
import EditUserPhotoModal from '@/components/pages/Profile/EditUserPhotoModal';
import BirthdayCelebration from '@/components/pages/Profile/BirthdaySelebration';

const ProfilePage = ({ id }: { id?: string }) => {
	const { user, isAdmin } = useAuth();
	const [open, setOpen] = useState(false);
	const [openPhoto, setOpenPhoto] = useState(false);
	const api = useApi();
	const userId = useMemo(() => {
		return id || user?.id;
	}, [id, user?.id]);

	const { data: anotherUser, isLoading } = useQuery({
		queryKey: ['another-user', { userId }],
		queryFn: async (): Promise<UserData> => {
			const url = userId
				? `/auth/get-another-user?userId=${userId}`
				: '/auth/get-another-user';
			const resp = await api.get(url);

			return await resp?.data;
		},
	});

	if (isLoading || !anotherUser) {
		return <FullPageLoader />;
	}

	return (
		<div className="flex-grow container mx-auto px-4 py-8">
			<BirthdayCelebration
				name={anotherUser?.name || ''}
				birthDate={anotherUser?.bornDate || ''}
			/>
			<div className={'flex flex-row justify-between self-start mb-6'}>
				<h1 className="text-2xl font-bold">Профиль пользователя</h1>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
				<Card className="col-span-1 pt-6">
					<CardContent className="flex flex-col items-center">
						<UserCard
							user={anotherUser}
							full
							big
							onEdit={!!id || isAdmin ? () => setOpenPhoto(true) : undefined}
						/>
					</CardContent>
				</Card>

				<Card className="col-span-1 md:col-span-2 pt-6">
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center">
								<Mail className="mr-2 h-4 w-4 text-gray-400" />
								<span className="text-sm">возможная@почта.бу</span>
							</div>
							<div className="flex items-center">
								<Phone className="mr-2 h-4 w-4 text-gray-400" />
								<span className="text-sm">{anotherUser?.tel}</span>
							</div>
							<div className="flex items-center">
								<Building className="mr-2 h-4 w-4 text-gray-400" />
								<span className="text-sm">{anotherUser?.position ?? ''}</span>
							</div>
							<div className="flex items-center">
								<Calendar className="mr-2 h-4 w-4 text-gray-400" />
								<span className="text-sm">
									День рождения:{' '}
									{anotherUser?.bornDate
										? format(anotherUser?.bornDate, 'yyyy-MM-dd')
										: ''}
								</span>
							</div>
							<Button variant="outline" size="sm" onClick={() => setOpen(true)}>
								<Edit2 className="mr-2 h-4 w-4" />
								Редактировать профиль
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			<Presentation user={anotherUser} />

			<EditUserModal
				open={open}
				user={anotherUser}
				onClose={() => setOpen(false)}
				isSelf={!id}
			/>
			<EditUserPhotoModal
				open={openPhoto}
				user={anotherUser}
				onClose={() => setOpenPhoto(false)}
				isSelf={!id}
			/>
		</div>
	);
};

export { ProfilePage };
