import { Button } from '@/components/ui/button';
import type { Assignment } from '@/types/education';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Clock, Download, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { getIconForMaterial } from '@/lib/getIconForMaterial';
import { useFinishMaterial } from '@/lib/api/queries/Education/mutations/material/useFinishMaterial';

interface LearningMaterialsProps {
	materialAssignments?: Assignment[];
}

export default function LearningMaterials({
	materialAssignments,
}: LearningMaterialsProps) {
	const { mutate: finishMaterial } = useFinishMaterial();

	const handleFinishMaterial = async (materialId?: string) => {
		if (materialId) {
			finishMaterial(materialId);
		}
	};

	if (materialAssignments?.length === 0) {
		return (
			<div className="text-center py-8">
				<h3 className="text-lg font-medium mb-2">
					У вас нет новых материалов для изучения
				</h3>
				<p className="text-muted-foreground">
					Когда вам будут назначены обучающие материалы, они появятся здесь
				</p>
			</div>
		);
	}

	return (
		<div>
			<h2 className="text-xl font-semibold mb-4">Материалы для изучения</h2>
			<div className="grid gap-4 md:grid-cols-2">
				{materialAssignments?.map((assignment) => {
					if (!assignment?.material) {
						return null;
					}
					return (
						<div
							key={assignment?.material?.id}
							className="border bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
						>
							<div className="p-5">
								<div className="flex items-start justify-between mb-2">
									<div className="flex items-center">
										{getIconForMaterial(
											assignment?.material?.url,
											!!assignment?.material?.fileUrl,
										)}
										<h3 className="text-lg font-medium ml-2">
											{assignment?.material?.title}
										</h3>
									</div>
								</div>
								<div className="flex items-center text-sm text-muted-foreground mb-2">
									<Clock className="h-4 w-4 mr-1" />
									<span>
										Добавлен{' '}
										{formatDistanceToNow(
											new Date(assignment?.material?.createdAt),
											{
												addSuffix: true,
												locale: ru,
											},
										)}
									</span>
								</div>
								{assignment?.dueDate && (
									<div className="flex items-center text-sm text-muted-foreground mb-4">
										<Clock className="h-4 w-4 mr-1" />
										<span>
											Время готовности{' '}
											{formatDistanceToNow(new Date(assignment?.dueDate), {
												addSuffix: true,
												locale: ru,
											})}
										</span>
									</div>
								)}
								<div className="flex justify-end">
									{!assignment?.completedAt && (
										<Button
											className={'mr-2'}
											onClick={() => {
												handleFinishMaterial(assignment?.material?.id);
											}}
											variant="outline"
										>
											Ознакомился
										</Button>
									)}
									<Link
										href={
											assignment?.material?.url ||
											assignment?.material?.fileUrl ||
											''
										}
									>
										<Button variant="default">
											{assignment?.material?.fileUrl ? (
												<>
													<span>Перейти по ссылке</span>
													<LinkIcon className="h-4 w-4 ml-2" />
												</>
											) : (
												<>
													<span>Скачать материал</span>
													<Download className="h-4 w-4 ml-2" />
												</>
											)}
										</Button>
									</Link>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
