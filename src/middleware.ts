// The middleware here allows standw as a mediator between Clerk and our Next.js app.
import { authMiddleware } from "@clerk/nextjs";


// Automatically redirect to login for every page
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

// This function lists which routes do not reqire a login
export default authMiddleware({
  publicRoutes: ["/", "/api/webhooks(.*)"]
})