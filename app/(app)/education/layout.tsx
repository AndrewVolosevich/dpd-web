import type { ReactNode } from 'react';

type TrainingLayoutProps = {
	children: ReactNode;
};

export default function TrainingLayout({ children }: TrainingLayoutProps) {
	return <>{children}</>;
}
