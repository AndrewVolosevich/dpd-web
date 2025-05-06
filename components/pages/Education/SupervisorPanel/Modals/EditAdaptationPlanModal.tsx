'use client';

import type React from 'react';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { FileText, X } from 'lucide-react';
import { ExtendedUserData } from '@/types/entities';
import { Assignment } from '@/types/education';
import { getFileNameFromUrl } from '@/lib/getFileNameFromUrl';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { useUpdateAdaptationTask } from '@/lib/api/queries/Education/mutations/assign/useUpdateAdaptationTask';
import DatePickerPopoverWithFields from '@/components/common/DatePickerPopover/DatePickerPopoverWithFields';

interface EditAdaptationPlanModalProps {
	isOpen: boolean;
	onClose: () => void;
	employee: ExtendedUserData;
	assignment: Assignment | null;
}

export function EditAdaptationPlanModal({
	isOpen,
	onClose,
	employee,
	assignment,
}: EditAdaptationPlanModalProps) {
	const { user } = useAuth();
	const [file, setFile] = useState<File | null>(null);
	const [startDate, setStartDate] = useState<Date | undefined>(new Date());
	const [dueDate, setDueDate] = useState<Date | undefined>(
		new Date(
			assignment?.dueDate ||
				new Date(new Date().setMonth(new Date().getMonth() + 1)),
		),
	);

	const { mutate: updatePlan, isPending } = useUpdateAdaptationTask();
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
		}
	};
	const handleRefreshValues = () => {
		setFile(null);
		setDueDate(new Date(new Date().setMonth(new Date().getMonth() + 3)));
	};
	const getDateInputDisabled = (date: Date) => date < new Date();
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData();

		if (user?.positionId && dueDate && startDate && file) {
			formData.append('file', file);
			formData.append('userPanelId', employee?.userPanelId || '');
			formData.append('startDate', startDate.toISOString());
			formData.append('dueDate', dueDate.toISOString());
			formData.append('planId', assignment?.adaptationPlan?.id || '');
			formData.append('supervisorPositionId', user?.positionId);

			updatePlan(formData, {
				onSuccess: () => {
					handleRefreshValues();
					onClose();
				},
			});
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Редактировать план адаптации</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-4">
					<div className="space-y-2">
						<Label>Сотрудник</Label>
						<div className="p-2 bg-muted rounded-md">
							{employee?.surname} {employee?.name} {employee?.patronymic}
							<div className="text-sm text-muted-foreground">
								{employee?.position?.title}
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="startDate">Дата начала адаптации</Label>
						<DatePickerPopoverWithFields
							formControl={false}
							value={startDate}
							disabled={getDateInputDisabled}
							onChange={(e) => {
								if (e) {
									setStartDate(e);
								}
							}}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="endDate">Дата окончания адаптации</Label>
						<DatePickerPopoverWithFields
							formControl={false}
							value={dueDate}
							disabled={getDateInputDisabled}
							onChange={(e) => {
								if (e) {
									setDueDate(e);
								}
							}}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="file">Файл плана адаптации</Label>
						{!file ? (
							<div className="border rounded-md p-3 flex items-center justify-between">
								<div className="flex items-center">
									<FileText className="h-5 w-5 mr-2 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">
											{getFileNameFromUrl(assignment?.adaptationPlan?.fileUrl)}
										</p>
										{assignment?.createdAt && (
											<p className="text-xs text-muted-foreground">
												Загружен:{' '}
												{format(new Date(assignment?.createdAt), 'dd.MM.yyyy')}
											</p>
										)}
									</div>
								</div>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => document.getElementById('file')?.click()}
								>
									Заменить
								</Button>
								<Input
									id="file"
									type="file"
									className="hidden"
									accept=".pdf,.doc,.docx,.xls,.xlsx"
									onChange={handleFileChange}
								/>
							</div>
						) : (
							<div className="flex items-center justify-between p-2 border rounded-md">
								<div className="flex items-center">
									<div className="ml-2 truncate">
										<p className="text-sm font-medium">{file.name}</p>
										<p className="text-xs text-muted-foreground">
											{(file.size / 1024 / 1024).toFixed(2)} МБ
										</p>
									</div>
								</div>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => setFile(null)}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						)}
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							Отмена
						</Button>
						<Button type="submit" disabled={!dueDate || isPending}>
							{isPending ? 'Сохранение...' : 'Сохранить изменения'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
