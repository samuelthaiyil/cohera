import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/notebooks', req.url));
  }

  if (!userId) {
    return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
