export const dynamic = 'force-dynamic';
import { ProfilePage } from '@/components/pages/Profile/ProfilePage';

interface ProfilePageProps {
	params: Promise<{
		userId: string;
	}>;
}

export default async function Profile({ params }: ProfilePageProps) {
	const { userId } = await params;
	return (
		<main>
			<ProfilePage id={userId} />
		</main>
	);
}
