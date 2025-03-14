import React, { useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserData } from '@/types/entities';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import useApi from '@/hooks/useApi';
import DatePickerPopoverWithFields from '@/components/common/DatePickerPopover/DatePickerPopoverWithFields';
import { getStartDateISO } from '@/lib/date/helpers';

const formSchema = z.object({
	name: z.string().min(1, 'Имя обязательно'),
	surname: z.string().min(1, 'Фамилия обязательна'),
	password: z.string().optional(),
	patronymic: z.string().optional(),
	tel: z.string().min(1, 'Телефон обязателен'),
	department: z.string().optional(),
	position: z.string().optional(),
	isSupervisor: z.boolean().optional(),
	startDate: z.date().optional(),
	endDate: z.date().optional(),
	bornDate: z.date().optional(),
});

interface EditUserFormProps {
	user?: UserData;
	isSelf: boolean;
	onClose: () => void;
}

const EditUserForm = ({ user, onClose, isSelf }: EditUserFormProps) => {
	const { isAdmin, updateUser: updateSelfUser } = useAuth();
	const api = useApi();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: user?.name ?? '',
			surname: user?.surname ?? '',
			patronymic: user?.patronymic ?? '',
			password: '',
			tel: user?.tel ?? '',
			department: user?.department ?? '',
			position: user?.position ?? '',
			isSupervisor: user?.isSupervisor ?? false,
			startDate: user?.startDate
				? (new Date(user?.startDate) as Date)
				: undefined,
			endDate: user?.endDate ? (new Date(user?.endDate) as Date) : undefined,
			bornDate: user?.bornDate ? (new Date(user?.bornDate) as Date) : undefined,
		},
	});

	const queryClient = useQueryClient();
	const { mutate: updateUser, isPending: updateLoading } = useMutation({
		mutationFn: async (userData: any) => {
			const resp = await api.post(`/auth/update-user`, { ...userData });
			return resp?.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное изменение пользователя',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: async (u) => {
			if (isSelf) {
				updateSelfUser(u);
			}

			await queryClient.invalidateQueries({
				queryKey: ['new-users'],
			});
			await queryClient.invalidateQueries({
				queryKey: ['another-user'],
			});
			await queryClient.invalidateQueries({
				queryKey: ['paginated-users'],
			});
			await queryClient.invalidateQueries({
				queryKey: ['users-by-birthdays'],
			});

			toast({
				title: 'Пользователь успешно изменен',
				variant: 'default',
			});
		},
		onSettled: () => {
			onClose();
		},
	});

	const { mutate: createUser, isPending: createLoading } = useMutation({
		mutationFn: async (userData: any) => {
			const resp = await api.post(`/auth/create-user`, { ...userData });
			return resp?.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное создание пользователя',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: async (u) => {
			if (isSelf) {
				updateSelfUser(u);
			} else {
				await queryClient.invalidateQueries({
					queryKey: ['another-user'],
				});
				await queryClient.invalidateQueries({
					queryKey: ['paginated-users'],
				});
			}
			toast({
				title: 'Пользователь успешно создан',
				variant: 'default',
			});
		},
		onSettled: () => {
			onClose();
		},
	});

	const canEdit = useMemo(() => isSelf || isAdmin, [isAdmin, isSelf]);
	const isLoading = useMemo(
		() => updateLoading || createLoading,
		[updateLoading, createLoading],
	);
	const isForCreate = useMemo(() => !user?.id, [user]);

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		const userToUpdate = {
			...values,
			id: user?.id,
			startDate: getStartDateISO(values?.startDate),
			endDate: getStartDateISO(values?.endDate),
			bornDate: getStartDateISO(values?.bornDate),
		};
		if (isForCreate) {
			createUser(userToUpdate);
		} else {
			updateUser(userToUpdate);
		}
	};

	const getDateInputDisabled = (date: Date) =>
		date > new Date() || date < new Date('1900-01-01');

	return (
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="surname"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Фамилия</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Имя</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="patronymic"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Отчество</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="tel"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Телефон</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{canEdit && (
						<>
							{!user && (
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Пароль</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="department"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Отдел</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Выберите отдел" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="it">IT отдел</SelectItem>
													<SelectItem value="hr">HR отдел</SelectItem>
													<SelectItem value="sales">Отдел продаж</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="position"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Должность</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="isSupervisor"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center space-x-3 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<FormLabel className="font-normal">Руководитель</FormLabel>
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="startDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Дата начала работы</FormLabel>
											<DatePickerPopoverWithFields
												value={field.value}
												onChange={field.onChange}
												disabled={getDateInputDisabled}
											/>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="endDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Дата окончания работы</FormLabel>
											<DatePickerPopoverWithFields
												value={field.value}
												onChange={field.onChange}
												disabled={getDateInputDisabled}
											/>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</>
					)}

					<FormField
						control={form.control}
						name="bornDate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Дата рождения</FormLabel>
								<DatePickerPopoverWithFields
									value={field.value}
									onChange={field.onChange}
									disabled={getDateInputDisabled}
								/>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex justify-end space-x-4 pt-4">
						<Button variant="outline" onClick={onClose} type="button">
							Отмена
						</Button>
						<Button variant="destructive" type="submit" disabled={isLoading}>
							{isLoading ? 'Сохранение...' : 'Сохранить'}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default EditUserForm;
