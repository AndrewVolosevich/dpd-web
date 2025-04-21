import { CabinetPage } from '@/components/pages/Education/Cabinets/CabinetPage';

interface PageProps {
	params: Promise<{
		cabinetId: string;
	}>;
}

export default async function Page({ params }: PageProps) {
	const { cabinetId } = await params;
	return <CabinetPage cabinetId={cabinetId} />;
}
