"use client";
import { UserButton, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export default function Nav() {
  // We use the useUser hook to get the user object and the isLoaded boolean. This is built in when we install Clerk. The isLoaded boolean is used to check if the user object is loaded before we display the dashboard.
  const { user, isLoaded } = useUser();

  return (
    <header>
      <nav
        className="flex items-center justify-between p-6 lg:px-8 border border-t-0 border-l-0 border-r-0 border-b-gray-600"
        aria-label="Global"
      >
       
          {/* Checks to see if we are logged in before we display the dashboard */}
          {isLoaded && user && (
             <div className="flex flex-col items-left space-y-4">
              <Link href="/dashboard">Dashboard</Link>
              <UserButton afterSignOutUrl="/">Sign out</UserButton>
            </div>
          )}
          {/* If we are not logged in, we display the sign in and sign up buttonsd */}
       
        
          {isLoaded && !user && (
            <div className="flex space-x-4">
              <SignInButton><button className="bg-red-800 p-2 rounded-md cursor-pointer hover:bg-red-300 active:bg-white active:text-red-800">Log in</button></SignInButton>
              <SignUpButton><button className="bg-red-800 p-2 rounded-md cursor-pointer hover:bg-red-300 active:bg-white active:text-red-800">Sign In</button></SignUpButton>
            </div>
          )}

        <div className="flex lg_flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            Next.js Authentication
          </a>
        </div>
      </nav>
    </header>
  );
}
