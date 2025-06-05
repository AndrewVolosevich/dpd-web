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
import { Upload, X } from 'lucide-react';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { useAssignAdaptationTask } from '@/lib/api/queries/Education/mutations/assign/useAssignAdaptationTask';
import DatePickerPopoverWithFields from '@/components/common/DatePickerPopover/DatePickerPopoverWithFields';
import { ExtendedUserData } from '@/types/entities';

interface CreateAdaptationPlanModalProps {
	isOpen: boolean;
	onClose: () => void;
	employee: ExtendedUserData;
}

export function CreateAdaptationPlanModal({
	isOpen,
	onClose,
	employee,
}: CreateAdaptationPlanModalProps) {
	const { user } = useAuth();
	const [file, setFile] = useState<File | null>(null);
	const [startDate, setStartDate] = useState<Date | undefined>(new Date());
	const [dueDate, setDueDate] = useState<Date | undefined>(
		new Date(new Date().setMonth(new Date().getMonth() + 1)),
	);

	const { mutate: assignAdaptationPlan, isPending } = useAssignAdaptationTask();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
		}
	};
	const getDateInputDisabled = (date: Date) => date < new Date();
	const handleRefreshValues = () => {
		setFile(null);
		setDueDate(new Date(new Date().setMonth(new Date().getMonth() + 3)));
	};

	const handleClose = () => {
		onClose();
		handleRefreshValues();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData();

		if (user?.positionId && dueDate && startDate && file) {
			formData.append('file', file);
			formData.append('userPanelId', employee?.userPanelId || '');
			formData.append('startDate', startDate.toISOString());
			formData.append('dueDate', dueDate.toISOString());
			formData.append('supervisorPositionId', user?.positionId);

			assignAdaptationPlan(formData, {
				onSuccess: () => {
					handleClose();
				},
			});
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[500px] overflow-hidden">
				<DialogHeader>
					<DialogTitle>Добавить план адаптации</DialogTitle>
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
							<div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
								<Upload className="h-8 w-8 text-muted-foreground mb-2" />
								<p className="text-sm text-muted-foreground mb-2">
									Перетащите файл сюда или нажмите для выбора
								</p>
								<Input
									id="file"
									type="file"
									className="hidden"
									accept=".pdf,.doc,.docx,.xls,.xlsx"
									onChange={handleFileChange}
								/>
								<Button
									type="button"
									variant="outline"
									onClick={() => document.getElementById('file')?.click()}
								>
									Выбрать файл
								</Button>
							</div>
						) : (
							<div className="flex items-center justify-between p-2 border rounded-md">
								<div className="flex items-center">
									<div className="ml-2 max-w-[380px]">
										<p className="text-sm font-medium truncate">{file.name}</p>
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
						<Button type="button" variant="outline" onClick={handleClose}>
							Отмена
						</Button>
						<Button type="submit" disabled={!file || !dueDate || isPending}>
							{isPending ? 'Загрузка...' : 'Загрузить план'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
