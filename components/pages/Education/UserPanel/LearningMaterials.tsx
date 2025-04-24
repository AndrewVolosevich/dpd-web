import { Button } from '@/components/ui/button';
import type { TrainingMaterial } from '@/types/education';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
	BookOpen,
	Clock,
	Download,
	FileText,
	PresentationIcon,
} from 'lucide-react';
import Link from 'next/link';

interface LearningMaterialsProps {
	materials: TrainingMaterial[];
}

export default function LearningMaterials({
	materials,
}: LearningMaterialsProps) {
	if (materials.length === 0) {
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

	const getFileIcon = (type: string) => {
		switch (type) {
			case 'PDF':
				return <FileText className="h-4 w-4" />;
			case 'PRESENTATION':
				return <PresentationIcon className="h-4 w-4" />;
			default:
				return <BookOpen className="h-4 w-4" />;
		}
	};

	return (
		<div>
			<h2 className="text-xl font-semibold mb-4">Материалы для изучения</h2>
			<div className="grid gap-4 md:grid-cols-2">
				{materials.map((material) => (
					<div
						key={material.id}
						className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
					>
						<div className="p-5">
							<div className="flex items-start justify-between mb-2">
								<div className="flex items-center">
									{getFileIcon(material.type)}
									<h3 className="text-lg font-medium ml-2">{material.title}</h3>
								</div>
							</div>
							<div className="flex items-center text-sm text-muted-foreground mb-4">
								<Clock className="h-4 w-4 mr-1" />
								<span>
									Добавлен{' '}
									{formatDistanceToNow(new Date(material.createdAt), {
										addSuffix: true,
										locale: ru,
									})}
								</span>
							</div>
							<div className="flex justify-end">
								<Link href={material.url || material.fileUrl || ''}>
									<Button variant="outline">
										<span>Скачать материал</span>
										<Download className="h-4 w-4 ml-2" />
									</Button>
								</Link>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
