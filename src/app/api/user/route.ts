import type { NextApiRequest, NextApiResponse } from 'next';

// Define a type for the response data to improve type-checking.
interface UserData {
  gamesPlayed: number;
  lastFiveWR: string[];
  email: string;
  about: string;
  profileImage: string;
}

// Named export for the GET method
export async function GET(req: NextApiRequest, res: NextApiResponse<UserData | { message: string }>) {
    const userData: UserData = {
      gamesPlayed: 23,
      lastFiveWR: ["win", "win", "loss", "loss", "win"],
      email: "examplemail@gmail.com",
      about: "I'm John Doe, a strategist in the digital realm...",
      profileImage: "/src/assets/Jackalope.png",
    };
  
    // Correctly respond with the hardcoded data
    return new Response(JSON.stringify(userData), {
        status: 200,
    })
  }