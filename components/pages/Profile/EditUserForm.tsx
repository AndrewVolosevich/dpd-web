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
import { useAuth } from '@/components/providers/global/AuthProvider';
import { useQueryClient } from '@tanstack/react-query';
import DatePickerPopoverWithFields from '@/components/common/DatePickerPopover/DatePickerPopoverWithFields';
import { getStartDateISO } from '@/lib/date/helpers';
import { useUpdateUser } from '@/lib/api/queries/Users/mutations/useUpdateUser';
import { useCreateUser } from '@/lib/api/queries/Users/mutations/useCreateUser';

const formSchema = z.object({
	name: z.string().min(1, 'Имя обязательно'),
	surname: z.string().min(1, 'Фамилия обязательна'),
	password: z.string().optional(),
	patronymic: z.string().optional(),
	tel: z
		.string()
		.min(9, 'Телефон обязателен, 9 цифр')
		.refine((val) => /^\d+$/.test(val), {
			message: 'Телефон должен содержать только цифры',
		}),
	internalPhone: z
		.string()
		.optional()
		.refine((val) => !val || (val.length >= 4 && /^\d+$/.test(val)), {
			message: 'Внутренний телефон должен содержать только цифры, минимум 4',
		}),
	phone: z
		.string()
		.optional()
		.refine((val) => !val || (val.length >= 9 && /^\d+$/.test(val)), {
			message:
				'Дополнительный телефон должен содержать только цифры, минимум 9',
		}),
	email: z
		.string()
		.optional()
		.refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
			message: 'Неверный формат email',
		}),
	badge: z.string().optional(),
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
	const { updateUser: updateSelfUser } = useAuth();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: user?.name ?? '',
			surname: user?.surname ?? '',
			patronymic: user?.patronymic ?? '',
			password: '',
			tel: user?.tel ?? '',
			internalPhone: user?.internalPhone ?? '',
			phone: user?.phone ?? '',
			email: user?.email ?? '',
			badge: user?.badge ?? '',
			isSupervisor: user?.roles?.some((r) => r === 'SUPERVISOR'),
			startDate: user?.startDate
				? (new Date(user?.startDate) as Date)
				: undefined,
			endDate: user?.endDate ? (new Date(user?.endDate) as Date) : undefined,
			bornDate: user?.bornDate ? (new Date(user?.bornDate) as Date) : undefined,
		},
	});

	const queryClient = useQueryClient();

	const { mutate: updateUser, isPending: updateLoading } = useUpdateUser();
	const { mutate: createUser, isPending: createLoading } = useCreateUser();

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
			createUser(userToUpdate, {
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
					form.reset();
					onClose();
				},
			});
		} else {
			updateUser(userToUpdate, {
				onSuccess: (u) => {
					if (isSelf) {
						updateSelfUser(u);
					}
					form.reset();
					onClose();
				},
			});
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
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
						<FormField
							control={form.control}
							name="internalPhone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Внутренний телефон</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<>
						{/* Поле доп телефона и емейла */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Доп. телефон</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email сотрудника</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{/*Пароль*/}
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

						<FormField
							control={form.control}
							name="badge"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Бейдж</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
