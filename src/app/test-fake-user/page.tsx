'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';

const TestFakeUser = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gamesWon: 0,
    gamesLost: 0,
    gamesDrawn: 0,
    about: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/update-user-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 max-w-sm mx-auto mt-10 shadow-lg">
      <div className="mb-4">
        <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">
          First Name
        </label>
        <input
          type="text"
          name="firstName"
          id="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">
          Last Name
        </label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="gamesWon" className="block text-gray-700 text-sm font-bold mb-2">
          Games Won
        </label>
        <input
          type="number"
          name="gamesWon"
          id="gamesWon"
          value={formData.gamesWon}
          onChange={handleChange}
          placeholder="Games Won"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="gamesLost" className="block text-gray-700 text-sm font-bold mb-2">
          Games Lost
        </label>
        <input
          type="number"
          name="gamesLost"
          id="gamesLost"
          value={formData.gamesLost}
          onChange={handleChange}
          placeholder="Games Lost"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="gamesDrawn" className="block text-gray-700 text-sm font-bold mb-2">
          Games Drawn
        </label>
        <input
          type="number"
          name="gamesDrawn"
          id="gamesDrawn"
          value={formData.gamesDrawn}
          onChange={handleChange}
          placeholder="Games Drawn"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="about" className="block text-gray-700 text-sm font-bold mb-2">
          About
        </label>
        <textarea
          name="about"
          id="about"
          value={formData.about}
          onChange={handleChange}
          placeholder="About"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        ></textarea>
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Submit
      </button>
    </form>
  );
};

export default TestFakeUser;
