import React, { useState } from "react";

function ShowGameDetails() {
  const [gameId, setGameId] = useState('');
  const [gameName, setGameName] = useState('');
  const [gameDetails, setGameDetails] = useState(null);
  const [error, setError] = useState('');
  const [games, setGames] = useState('');
  const [name, setName] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const fetchGameDetailsById = async (e) => {
    e.preventDefault();
    setError('');
    setGameDetails(null);

    try {
      const response = await fetch(`http://localhost:8081/games/game/${gameId}`);
      if (!response.ok) {
        throw new Error('Game not found');
      }
      const data = await response.json();
      setGameDetails(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Search games by name
  const searchGamesByName = async (e) => {
    e.preventDefault();
    setError('');
    setSearchResults(null);

    try {
      console.log(`Searching for game: ${gameName}`);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/api/game/${gameName}`);
      console.log(response.ok, response.status)
      if (!response.ok) {
        const errorData = await response.json(); // error message from backend
        throw new Error(errorData.error || 'No games found'); // Show backend error message if available
      }
      
      const data = await response.json();
      console.log(data);
      setSearchResults(data);
    
    } catch (err) {
      console.error('Frontend error:', err.message);
      setError(err.message);
    }
  };

  return (
    <div className="center-container">
      <div className="search-bar">
      <h1>Search for a Game</h1>
      <form onSubmit={searchGamesByName}>
        <input
          type="text"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          placeholder="Enter Game Name"
        />
        <button type="submit">Search</button>
      </form>
   </div>

      {searchResults && (
        <div className="center-container">
          <h2>Search Results</h2>
          {searchResults.map((game, index) => (
            <div key={index} className="card">
              <a href={`gamePage/${game.id}`}>
              <p><strong>Name:</strong> {game.name}</p>
              <p><strong>Cover:</strong> <img src={game.img} alt={game.name} /></p>
              <p><strong>Additional Cover:</strong> <img src={game.small_cap} alt={game.name} /></p>
              {/* Display additional fields as needed */}
            </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


  export default ShowGameDetails;