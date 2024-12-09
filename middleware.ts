import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const user = request.cookies.get('user');
	const userId = user?.value ? JSON.parse(user?.value || '')?.id : '';

	if (request.nextUrl.pathname.startsWith('/sign-in') && userId) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	if (
		request.nextUrl.pathname.startsWith('/sign-in') ||
		request.nextUrl.pathname.startsWith('/api')
	) {
		return NextResponse.next();
	}
	if (!userId) {
		return NextResponse.redirect(new URL('/sign-in', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
};
