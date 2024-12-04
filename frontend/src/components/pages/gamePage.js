import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function GamePage() {
  const { gameId } = useParams();
  const [gameDetails, setGameDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleStarClick = (star) => {
    setRating(star);
  };
  

 
  useEffect(() => {
    console.log("Fetching game details for ID:", gameId);
    
    const fetchGameDetailsById = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8081/reviews/game/${gameId}`);
        
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

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert('Please select a star rating.');
      return;
    }
    if (reviewText.trim() === '') {
      alert('Please add a review comment.');
      return;
    }

    const reviewData = { gameId, rating, review: reviewText };

    try {
      const response = await fetch('http://localhost:8081/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) throw new Error('Failed to submit review');

      alert('Review submitted successfully!');
      setShowModal(false);
      setRating(0);
      setReviewText('');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  if (!gameDetails) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;


  return (
    <div>
      <h1>{gameDetails.name}</h1>
      <div className="card">
      <p><strong>Description:</strong> {gameDetails.desc}</p>
      <p><strong>Release Date:</strong> {gameDetails.release_date}</p>
      <p><strong>Genre:</strong> {gameDetails.tags && gameDetails.tags.slice(0, 3).join(", ")}</p>
      <p><strong>Publisher:</strong> {gameDetails.dev_details.publisher && gameDetails.dev_details.publisher.join(", ")}</p>
      </div>
      <Button className="me-2" onClick={handleShow}>
        Make a Review
      </Button>
      
      
        <div className="card">
      <h3>Screenshots</h3>
      <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '10px', overflowX: 'auto' }}>
      {gameDetails.images.screenshot &&
        gameDetails.images.screenshot.map((screenshot, index) => (
          <a href={screenshot} target="_blank" rel="noopener noreferrer"> 
        <img
          key={index}
          src={screenshot}
          alt={`Screenshot ${index + 1}`}
          style={{ width: '200px', height: 'auto', borderRadius: '5px' }}
        />
      </a>
      ))}
      </div>
  </div>

      {/* Add more details as needed */}
      

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Review Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h2>Rate This Game</h2>
          <div className="star-rating">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={`star ${rating >= index + 1 ? 'selected' : ''}`}
                onClick={() => handleStarClick(index + 1)}
              >
                &#9733;
              </span>
            ))}
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            style={{
              width: '100%',
              height: '100px',
              marginTop: '10px',
              borderRadius: '5px',
              padding: '10px',
              border: '1px solid #ccc',
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitReview}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
   
}
export default GamePage;