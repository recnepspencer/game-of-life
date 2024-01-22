"use client";
import { UserButton, useUser } from "@clerk/nextjs";
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
        <div className="flex flex-col items-left space-y-4">
          {/* Checks to see if we are logged in before we display the dashboard */}
          {isLoaded && user && (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <UserButton afterSignOutUrl="/">Sign out</UserButton>
            </>
          )}
        </div>


        <div className="flex lg_flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            Next.js Authentication
          </a>
        </div>
      </nav>
    </header>
  );
}
