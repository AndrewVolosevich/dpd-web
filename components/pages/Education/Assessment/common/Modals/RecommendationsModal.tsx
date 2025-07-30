'use client';

import React, { useEffect, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessageSquare } from 'lucide-react';
import {
	Assessment,
	AssessmentRecommendation,
	AssessmentStatus,
} from '@/types/assessment';

import { useUpdateRecommendations } from '@/lib/api/queries/Assessment/mutations/useUpdateRecommendations';

interface RecommendationsModalProps {
	assessmentId: string;
	isOpen: boolean;
	onClose: () => void;
	assessment?: Assessment;
	recommendations: AssessmentRecommendation[];
}

export const RecommendationsModal = ({
	isOpen,
	assessmentId,
	onClose,
	assessment,
	recommendations,
}: RecommendationsModalProps) => {
	const [formData, setFormData] = useState<AssessmentRecommendation[]>([]);
	const { mutate: updateRecommendations, isPending: isLoading } =
		useUpdateRecommendations();

	useEffect(() => {
		if (recommendations && recommendations.length > 0) {
			setFormData([...recommendations]);
		}
	}, [recommendations, isOpen]);

	const handleSubmit = () => {
		if (formData.length > 0) {
			updateRecommendations(
				{ recommendations: formData, assessmentId },
				{
					onSuccess: () => {
						onClose();
					},
				},
			);
		}
	};

	const handleFieldChange = (id: string, value: string) => {
		setFormData((prev) =>
			prev.map((item) =>
				item.id === id ? { ...item, recommendation: value } : item,
			),
		);
	};

	const getIsAvailable = () => {
		return (
			!!formData[0]?.recommendation?.length &&
			!!formData[1]?.recommendation?.length &&
			!!formData[2]?.recommendation?.length &&
			assessment?.status === AssessmentStatus.SUPERVISOR_CONCLUSION
		);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center space-x-2">
						<MessageSquare className="w-5 h-5" />
						<span>Рекомендации и комментарии руководителя</span>
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					{formData.map((item) => (
						<div key={item.id} className="space-y-3">
							<Label
								htmlFor={`recommendation-${item.id}`}
								className="text-sm font-medium"
							>
								{item.title}
							</Label>
							<Textarea
								id={`recommendation-${item.id}`}
								placeholder={item?.description || ''}
								value={item.recommendation}
								onChange={(e) => handleFieldChange(item.id, e.target.value)}
								className="min-h-[90px] resize-none"
							/>
						</div>
					))}
				</div>

				{/* Actions */}
				<div className="flex justify-end space-x-2 pt-4">
					<Button variant="outline" onClick={onClose}>
						Отмена
					</Button>
					<Button
						type={'button'}
						disabled={isLoading && !getIsAvailable()}
						onClick={handleSubmit}
					>
						{isLoading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
						Сохранить рекомендации
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
