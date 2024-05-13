import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
	function middleware(req) {
		if (
			req.nextUrl.pathname.startsWith("/admin") &&
			req.nextauth.token?.role !== "admin"
		)
			return NextResponse.rewrite(
				new URL("/not-found?message=You Are Not Authorized!", req.url)
			);
		else if (
			req.nextUrl.pathname.startsWith("/user") &&
			req.nextauth.token?.role !== "user"
		)
			return NextResponse.rewrite(
				new URL("/not-found?message=You Are Not Authorized!", req.url)
			);
		else if (!req.nextauth.token) {
			return NextResponse.rewrite(new URL("/auth/sign-in!", req.url));
		}
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
	}
);

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|auth/|access-denied).*)",
	],
};
