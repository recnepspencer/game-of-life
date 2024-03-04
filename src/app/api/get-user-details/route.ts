// import { prisma } from "@/lib/db";
// import { withAuth } from '@clerk/nextjs/api';

// export default withAuth(async (req, res) => {
//   const { userId } = req.auth;
//   // Ensure externalId is properly fetched from the request, if needed
//   const externalId = userId; // This assumes Clerk's userId matches the externalId in your Prisma schema

//   if (!userId) {
//     return res.status(401).json({ message: 'Not authenticated' });
//   }

//   try {
//     // Fetch the user data along with specific details
//     const user = await prisma.user.findUnique({
//       where: {
//         externalId: externalId ?? undefined, // Match against Clerk's externalId
//       },
//       // Include any relations if necessary, for example, gameSessions if you want to fetch those as well
//     });

//     if (user) {
//       // Construct a response object with all the necessary user data
//       const userData = {
//         email: user.email,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         gamesPlayed: user.gamesPlayed,
//         gamesWon: user.gamesWon,
//         gamesLost: user.gamesLost,
//         gamesDrawn: user.gamesDrawn,
//         about: user.about,
//       };

//       res.status(200).json(userData);
//     } else {
//       res.status(404).json({ message: 'User not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch user data' });
//   }
// });
