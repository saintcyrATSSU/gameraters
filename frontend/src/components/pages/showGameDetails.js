import React, { useState } from "react";

function ShowGameDetails() {
  const [gameId, setGameId] = useState('');
  const [gameDetails, setGameDetails] = useState(null);
  const [error, setError] = useState('');
  const [games, setGames] = useState('');

  const fetchGameDetails = async (e) => {
    e.preventDefault();
    setError('');
    setGameDetails(null);

    try {
      const response = await fetch(`http://localhost:8081/games/game/${games}`);
      if (!response.ok) {
        throw new Error('Game not found');
      }
      const data = await response.json();
      setGameDetails(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Show Game Details</h1>
      <form onSubmit={fetchGameDetails}>
        <input
          type="text"
          value={games}
          onChange={(e) => setGames(e.target.value)}
          placeholder="Enter Game"
        />
        <button type="submit">Get Game Details</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {gameDetails && (
        <div>
          <h2>Game Details</h2>
          <p><strong>Name:</strong> {gameDetails.name}</p>
          <p><strong>Description:</strong> {gameDetails.desc}</p>
          <p><strong>Release Date:</strong> {gameDetails.release_date}</p>
        </div>
      )}
    </div>
  );
}


  export default ShowGameDetails;