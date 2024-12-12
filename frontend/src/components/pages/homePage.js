import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import getUserInfo from '../../utilities/decodeJwt';
import axios from 'axios';
import ProfileImage from "../images/ProfileImage.js";

const HomePage = () => {
    const [user, setUser] = useState({});
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        localStorage.removeItem('accessToken');
        return navigate('/');
    };

    useEffect(() => {
        setUser(getUserInfo());
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axios.get('http://localhost:8081/reviews/getAll');
            const sortedReviews = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Adjust API path if needed
            setReviews(sortedReviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };


    if (!user) return (
        <div><h4>Log in to view this page.</h4></div>
    );

    const { id, email, username } = user;

    return (
        <>
            <div className="card-container">
                <div className="card">
                    <h3>Welcome to GameRaters!</h3>
                    <p className="username">{username}</p>
                </div>
                <div className="card">
                    <p>You can find a game you like and you can rate them here 
                        at GameRaters. <Link to={`/showGameDetails`}>Click Here to Start Searching</Link>
                    </p>
                </div>
            </div>

            {/* Display the reviews */}
            <div className="center-container">
            <div className="reviews-container">
                <h3>All Reviews</h3>
                {reviews.length > 0 ? (
                    <ul>
                        {reviews.map((review) => (
                                <div className="review-row" key={review._id}>
                                <strong>Game:</strong> {review.gameName} <br />
                                <p><strong>@</strong> {review.username}</p>
                                <strong>Rating:</strong> {review.rating} <br />
                                <strong>Review:</strong> {review.review} <br />
                                <strong>Submitted At:</strong> {new Date(review.createdAt).toLocaleString()}
                                </div>
                           
                        ))}
                    </ul>
                ) : (
                    <p>No reviews available.</p>
                )}
            </div>
            </div>
        </>
    );
    
};
    


export default HomePage;