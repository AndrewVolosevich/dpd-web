import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { USER } from '@/const/common';

export function middleware(request: NextRequest) {
	if (request.nextUrl.pathname === '/404') {
		return NextResponse.next();
	}

	const user = request.cookies.get(USER);
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
		'/((?!_next/static|_next/image|favicon.ico|404|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		'/(api|trpc)(.*)',
	],
};
