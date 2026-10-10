import React, {useEffect} from 'react'
import {useNavigate, useRoutes} from 'react-router-dom'

//pages list
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/user/Profile';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

//AuthContext
import { useAuth } from './authContext'; //it will give status whether user is currently logged in or not

const ProjectRoutes = () => {
   const {currentUser, setCurrentUser} = useAuth();
   const navigate = useNavigate(); //hook use for redirection

   //when component will load first time will use effect
   useEffect(() => {
      const userIdFromStorage = localStorage.getItem("userId");

      if(userIdFromStorage && !currentUser) {   //useris is avaibale in storage but user is not logged in
        setCurrentUser(userIdFromStorage);
      } 

      if(!userIdFromStorage && !["/auth", "/signup"].includes(window.location.pathname)) {   //is we do not found existing userid
          navigate("/auth");
      }

      //alredy login
      if(userIdFromStorage && window.location.pathname == '/auth') {     //if user tries to open login page inspite of login
           navigate("/");
      }
    }, [currentUser, navigate, setCurrentUser]); //we have dependancy on 3 state variables means if any one of these value changes that would trigger a load

    let element = useRoutes([   //hook from react-router-dom
       {
          path: "/",
          element: <Dashboard/>
       },
       {
         path: "/auth",
         element: <Login/>
       },
       {
         path: "/signup",
         element: <Signup/>
       },
       {
         path: "/profile",
         element: <Profile/>
       }

    ]);
    
    return element;
}

export default ProjectRoutes;
