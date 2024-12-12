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
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, review: '' });
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleStarClick = (star) => {
    setRating(star);
  };
  

 
  const fetchReviewsByGameId = async () => {
    try {
      const response = await fetch(`http://localhost:8081/reviews/reviews/${gameId}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      const sortedReviews = data.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviews(sortedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to fetch reviews.');
    }
  };
    
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

  useEffect(() => {
    fetchGameDetailsById();
    fetchReviewsByGameId();
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

    const reviewData = { 
      userId: '674fe303d38bc450e2ff6fe2',
      username: 'MakenleyX3000' ,
      gameName: gameDetails.name,
      gameId, 
      rating, 
      review: reviewText 
    };

    try {
      const response = await fetch('http://localhost:8081/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) throw new Error('Failed to submit review');
      const savedReview = await response.json();
      setReviews((prevReviews) => [...prevReviews, savedReview.review]); // Add new review to the list
      setNewReview({ rating: 0, review: '' });
      setRating(0);
      setReviewText('');
      fetchReviewsByGameId();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  

  if (!gameDetails) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;


  return (
    <div
    style={{ 
      backgroundImage: 'url(frontend/src/components/images/depositphotos_562901082-stock-photo-rendering-illustration-gaming-background-abstract.jpg)', // Replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '20px',
    }}
    >
      <h1>{gameDetails.name}</h1>
      <div className="card">
      <p><strong>Description:</strong> {gameDetails.desc}</p>
      <p><strong>Release Date:</strong> {gameDetails.release_date}</p>
      <p><strong>Genre:</strong> {gameDetails.tags && gameDetails.tags.slice(0, 3).join(", ")}</p>
      <p><strong>Developer:</strong> {gameDetails.dev_details.developer_name && gameDetails.dev_details.developer_name.join(", ")}</p>
      <p><strong>Publisher:</strong> {gameDetails.dev_details.publisher && gameDetails.dev_details.publisher.join(", ")}</p>
      </div>
      
      
      <div className="card">
      <div className="center-container">
      <h3>Screenshots & Videos</h3>
      </div>
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
      <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '10px', overflowX: 'auto' }}>
    {gameDetails.images.videos &&
      gameDetails.images.videos.map((video, index) => (
        <video
          key={index}
          src={video}
          controls
          style={{ width: '300px', height: 'auto', borderRadius: '5px' }}
        >
          Your browser does not support the video tag.
        </video>
      ))}
  </div>
  </div>
      <Button className="me-2" onClick={handleShow}>
        Make a Review
      </Button>
      {/* Add more details as needed */}

      <div className="reviews-section">
        <div className='center-container'>
  <h3>Reviews</h3>
  {reviews.length === 0 ? (
    <p>No reviews yet. Be the first to review this game!</p>
  ) : (
    <ul>
      {reviews.map((review, index) => (
        <li key={index} className='card'>
          <p><strong>User:</strong> {review.username}</p>
          <p><strong>Rating:</strong> {review.rating} / 5</p>
          <p><strong>Review:</strong> {review.review}</p>
          <p><strong>Date:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>
  )}
  </div>
</div>
      
      

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