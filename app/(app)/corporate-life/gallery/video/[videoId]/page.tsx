import VideoPlayerPage from '@/components/pages/CorporateLife/Gallery/VideoPlayerPage';

interface VideoPlayerProps {
	params: Promise<{
		videoId: string;
	}>;
}

export default async function VideoPlayer({ params }: VideoPlayerProps) {
	const innerParams = await params;
	return (
		<div>
			<VideoPlayerPage videoId={innerParams.videoId} />
		</div>
	);
}
