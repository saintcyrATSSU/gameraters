import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import getUserInfo from '../../utilities/decodeJwt';
import axios from 'axios';
import ProfileImage from "../images/ProfileImage.js";

const HomePage = () => {
    const [user, setUser] = useState({});
    const [featuredReviews, setFeaturedReviews] = useState([]);
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        localStorage.removeItem('accessToken');
        return navigate('/');
    };

    useEffect(() => {
        setUser(getUserInfo());
    }, []);

    const fetchFeaturedReviews = async () => {
        const options = {
            method: 'GET',
            url: 'https://games-details.p.rapidapi.com/games',
            headers: {
                'X-RapidAPI-Key': '417d64baecmsh79798f9984757ebp1fd1f6jsn82142ba39f42',  // Replace with your actual RapidAPI key
                'X-RapidAPI-Host': 'games-details.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            const data = response.data; // Assuming the API response is an array of games
            const reviews = data.map(game => ({
                name: game.id,
                desc: game.title,
                rating: game.rating // Assuming API provides a rating
            }));
            setFeaturedReviews(reviews);
        } catch (error) {
            console.error('Error fetching game reviews:', error);
        }
    };

    fetchFeaturedReviews(); // Call the API when the component mounts


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
                        at GameRaters
                    </p>
                </div>
            </div>
        </>
    
    );
    };
    


export default HomePage;