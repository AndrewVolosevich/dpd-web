'use client';

import type { ReactNode } from 'react';
import { EducationSidebar } from '@/components/pages/Education/EducationSidebar';
import { usePathname } from 'next/navigation';
import { Routes } from '@/const/routes';
import { AssessmentSidebar } from '@/components/pages/Education/Assessment/AssesmentSidebar';

type TrainingLayoutProps = {
	children: ReactNode;
};

export default function TrainingLayout({ children }: TrainingLayoutProps) {
	const pathname = usePathname();

	const isAssessmentRoute = pathname.startsWith(
		`${Routes.EDUCATION}/assessment`,
	);

	return (
		<div className="flex h-full">
			<EducationSidebar />
			<>{children}</>
			{isAssessmentRoute && <AssessmentSidebar />}
		</div>
	);
}
