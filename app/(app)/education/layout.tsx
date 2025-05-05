import type { ReactNode } from 'react';
import { EducationSidebar } from '@/components/pages/Education/EducationSidebar';

type TrainingLayoutProps = {
	children: ReactNode;
};

export default function TrainingLayout({ children }: TrainingLayoutProps) {
	return (
		<div className="flex">
			<EducationSidebar />
			<>{children}</>
		</div>
	);
}
