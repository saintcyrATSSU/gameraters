import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import ProfileImage from "../images/ProfileImage.js";
import axios from 'axios';


//link to service
//http://localhost:8096/privateUserProfile

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({})
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUsername(userInfo.username);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/${userInfo.username}`);
      const userData = await response.json();
      setUsername(userData.username);
      setBio(userData.bio);
      setProfileImage(`${process.env.REACT_APP_BACKEND_SERVER_URI}${userData.profileImage}`);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    if (profileImage instanceof File) {
    formData.append("profileImage", profileImage);
  }
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/editUser`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, bio })
      });
      if (response.ok) {
        console.log("Profile updated successfully");
        handleClose();
        fetchUserProfile();
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };



  // handle logout button
  const handleLogout = (async) => {
    localStorage.clear();
    navigate("/login");
  };

  const fetchReviewsByUsername = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/reviews/user/${username}`);
      const sortedReviews = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviews(sortedReviews);
    } catch (err) {
      console.error('Error fetching reviews by username:', err.message);
      setError('Failed to fetch reviews.');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    setUser(getUserInfo())
    fetchUserProfile();
    fetchReviewsByUsername();
  }, [username]);


  // 	<span><b>{<FollowerCount username = {username}/>}</b></span>&nbsp;
  // <span><b>{<FollowingCount username = {username}/>}</b></span>;
  if (!user) return (<div><h4>Log in to view this page.</h4></div>)
    return (
      <div className="container">
        <div className="col-md-12 text-center">
          {/* Profile Image */}
        <div className="profile-image-container">
          <img
            src={profileImage || "/ProfileIcon.png"} // Use a default image if profileImage is unavailable
            alt={`${user.username}'s profile`}
            className="profile-image"
          />
        </div>
         <h1>{user.username}</h1>
          <div className="col-md-12 text-center">
            <>
              <Button className="me-2" onClick={handleShow}>
                Edit Profile
              </Button>
              <Button onClick={handleLogout}>
                Log Out
              </Button>
              
              <div className="profile-container">
              <h2>Your Reviews</h2>
              {loading && <p>Loading...</p>}
              
              {reviews.length === 0 ? (
              <p>No reviews submitted yet.</p>
            ) : (
           <ul>
          {reviews.map((review) => (
            <li key={review._id} className="review-item">
              <strong>Game:</strong> {review.gameName} <br />
              <strong>Rating:</strong> {review.rating} <br />
              <strong>Review:</strong> {review.review} <br />
              <strong>Date:</strong> {new Date(review.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
      </div>
              <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      value={username} readOnly
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bio" className="form-label">Biography</label>
                    <textarea
                      className="form-control"
                      id="bio"
                      rows="3"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                    <div className="mb-3">
                    <label htmlFor="profileImage" className="form-label">Profile Image</label>
                    <input
                    type="file"
                    className="form-control"
                    id="profileImage"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageChange(e)}
                    />
                </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleUpdateProfile}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
              
            </>
          </div>
        </div>
      </div>
    );
  };

export default PrivateUserProfile;
