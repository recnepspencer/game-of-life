import Image from "next/image";
import {auth} from '@clerk/nextjs'
import { redirect } from "next/navigation";

export default function Home() {
  const {userId} = auth();

  // If the user is logged in, redirect to the dashboard
  if(userId){
    redirect('/dashboard')


  }
  return (
    <main>
      <h1>
        The game of life
      </h1>
    </main>
  );
}
