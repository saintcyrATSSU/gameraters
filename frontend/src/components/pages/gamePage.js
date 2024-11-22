import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function GamePage() {
  const { gameId } = useParams();
  const [gameDetails, setGameDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  

 
  useEffect(() => {
    console.log("Fetching game details for ID:", gameId);
    
    const fetchGameDetailsById = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8081/games/game/${gameId}`);
        
        if (!response.ok) 
          throw new Error('Game not found');
        
        const data = await response.json();
        
        setGameDetails(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch game details.');
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchGameDetailsById();
  }, [gameId]);

  if (!gameDetails) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;


  return (
    <div>
      <h1>{gameDetails.name}</h1>
      <div className="card">
      <img src={gameDetails.img} alt={gameDetails.name} style={{ width: '100%' }} />
      <p><strong>Description:</strong> {gameDetails.desc}</p>
      <p><strong>Release Date:</strong> {gameDetails.release_date}</p>
      <p><strong>Genre:</strong> {gameDetails.tags}</p>
      <p><strong>Publisher:</strong> {gameDetails.publisher}</p>
      </div>
      {/* Add more details as needed */}
    </div>
    
  );
}
export default GamePage;