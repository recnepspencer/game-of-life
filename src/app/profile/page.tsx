"use client"
import React from "react";
import WinLossChart from "../components/profileComponents/WinLossChart";
import AboutCard from "../components/profileComponents/aboutCard";
// import './profilecomponents/ProfilePage.css'; // Import CSS file for styling
function ProfilePage() {
  return (
    <div className="profile-container">
      <AboutCard />
      <div className="win-loss-chart-container">
        <WinLossChart />
      </div>
    </div>
  );
}
export default ProfilePage;