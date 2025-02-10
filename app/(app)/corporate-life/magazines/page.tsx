import MagazinesPage from '@/components/pages/CorporateLife/Magazine/MagazinesPage';
import { getQueryClient } from '@/lib/getQueryClient';
import getServerTokenFromCookies from '@/lib/getServerTokenFromCookies';
import { prefetchMagazines } from '@/lib/api/queries/Magazines/prefetchMagazines';

export default async function Details() {
	const queryClient = getQueryClient();
	const token = await getServerTokenFromCookies();

	await queryClient.prefetchQuery({
		queryKey: ['magazines'],
		queryFn: async () => {
			return prefetchMagazines({ token });
		},
		retry: false,
	});
	return (
		<div>
			<MagazinesPage />
		</div>
	);
}
