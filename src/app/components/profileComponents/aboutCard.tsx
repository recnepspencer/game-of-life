import React, { useEffect, useState } from 'react';

function AboutCard() {
    // Initialize state for user data
    const [userData, setUserData] = useState({
        gamesPlayed: 0,
        lastFiveGames: [],
        profileEmail: '',
        aboutText: '',
        profileImage: '' // Assuming you might also want to fetch and display a dynamic profile image
    });

    useEffect(() => {
        fetch('/api/user', {
            headers: {
                // Include any necessary headers, such as authentication tokens
            }
        })
        .then(response => response.json())
        .then(data => {
            // Update the state with the fetched data
            setUserData({
                gamesPlayed: data.gamesPlayed,
                lastFiveGames: data.lastFiveWR, // Adjust based on how the data is returned from your API
                profileEmail: data.email,
                aboutText: data.about,
                profileImage: data.profileImage // Adjust based on your data structure
            });
        })
        .catch(error => console.error('Error fetching user data:', error));
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <div>
            <div className="card text-bg-primary mb-3">
                <img src={userData.profileImage} className="img-fluid" style={{ maxWidth: '200px', maxHeight: '200px' }} alt="Profile Image" />
                <div className="card-header">About</div>
                <div className="card-body">
                    <p className="card-text">Games Played: {userData.gamesPlayed}</p>
                    <p className="card-text">Last five games: {userData.lastFiveGames}</p>
                    <p className="card-text">{userData.aboutText}</p>
                    <p className="card-text">Email: {userData.profileEmail}</p>
                </div>
            </div>
        </div>
    );
}

export default AboutCard;