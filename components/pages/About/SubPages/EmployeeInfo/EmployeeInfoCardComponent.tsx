import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { EmployeeInfoCard } from '@/types/content';
import { useAuth } from '@/components/providers/global/AuthProvider';

interface ProfileCardProps {
	data: EmployeeInfoCard;
	onEdit?: () => void;
	onDelete?: () => void;
}

const EmployeeInfoCardComponent = ({
	data,
	onEdit,
	onDelete,
}: ProfileCardProps) => {
	const { isAdmin } = useAuth();
	return (
		<Card className="w-full mb-6">
			<CardContent className="p-6">
				<div className="flex flex-col lg:flex-row gap-12 relative">
					<div className="flex flex-col items-center">
						<div className="relative w-32 h-32 mb-4">
							<Image
								src={data?.imgUrl || '/placeholder.svg'}
								alt={data?.name}
								fill
								className="rounded-full object-cover"
							/>
						</div>
						<div className="flex flex-col items-center gap-2 w-full">
							<h3 className="text-md text-primary mb-1 w-full text-center">
								{data?.name}
							</h3>
							<p className="text-sm text-gray-600 w-full text-center">
								{data?.jobTitle}
							</p>
						</div>
					</div>

					<div className="flex-1">
						<div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
							{data?.content}
						</div>
					</div>

					{isAdmin && (
						<div className="flex lg:flex-col gap-2 justify-center lg:justify-start absolute top-0 right-0">
							<Button
								variant="outline"
								size="sm"
								onClick={onEdit}
								className="flex items-center gap-2"
							>
								<Edit className="w-4 h-4" />
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={onDelete}
								className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300"
							>
								<Trash2 className="w-4 h-4" />
							</Button>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default EmployeeInfoCardComponent;
