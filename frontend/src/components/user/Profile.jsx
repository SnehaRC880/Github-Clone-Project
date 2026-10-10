import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";
import Navbar from "../Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import HeatMapProfile from './HeapMap'
import { useAuth } from "../../authContext";

const Profile = () => {

   const navigate = useNavigate();
   
   const [userDetails, setUserDetails] = useState({username:"username" });

   const {setCurrentUser} = useAuth();

   useEffect(() => {
     const fetchUserDetails = async() => {
        const userId = localStorage.getItem("userId");
        if(userId) {   //if userId available fetch details
           try {
            const response = await axios.get(`http://localhost:3000/userProfile/${userId}`);
            console.log(response.data);
            setUserDetails(response.data.user);
           } catch(err) {
             console.error("Cannot fetch user Details: ", err);
           }
        }
     };
     fetchUserDetails();
   }, []);
 
  return (
    <>
      <Navbar />

      <UnderlineNav
  aria-label="Repository"
  className="profile-nav"
>
  <UnderlineNav.Item
    aria-current="page"
    icon={BookIcon}
    className="profile-nav-item"
  >
    Overview
  </UnderlineNav.Item>

  <UnderlineNav.Item
    onClick={() => navigate("/repo")}
    icon={RepoIcon}
    className="profile-nav-item"
  >
    Starred Repositories
  </UnderlineNav.Item>
</UnderlineNav>
      

      <button 
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setCurrentUser(null);

        window.location.href = '/auth';
      }}
      style={{ position: "fixed", bottom: "50px", right: "50px" }} id="logout">
       Logout
      </button>

      <div className="profile-page-wrapper">
        <div className="user-profile-section">
          <div className="profile-image"></div>

          <div className="name">
            <h3>{userDetails.username}</h3>
          </div>

          <button className="follow-btn">Follow</button>

          <div className="follower">
            <p>10 Follower</p>
            <p>3 Following</p>
          </div>
        </div>

        <div className="heat-map-section">
          <HeatMapProfile />
        </div>
      </div>
    </>
  );
};

export default Profile;