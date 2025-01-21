/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'placehold.co',
			},
			{
				protocol: 'https',
				hostname: 'storage-203.s3hoster.by',
			},
		],
	},
	staticPageGenerationTimeout: 120,
};

export default nextConfig;
