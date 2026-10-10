//context Api is a hook in react which is called create context and is available in react package

import React, {createContext, useState, useEffect, useContext, Children} from 'react'

const AuthContext = createContext();   //context will be a piece of data that will be available in every application(global data item)

//user data will be stored in local storage on login so when user will login JWT token will be taken in return and userId will be coming from backend will be stored in local storage
//every time user tries to access any route in frontend we will check if user is logged in or not to check that we are creating the context so that if user is on any screen will get that value

export const useAuth = () => {  //custom hook that will return context
    
    return useContext(AuthContext);
}

//authprovider will read the current user and will return it
export const AuthProvider = ({children}) => {       //wrap the application (we will write in main.jsxso that in any component we can access this value )
   
    const [currentUser, setCurrentUser] = useState(null) //current user id null means user id not logged in when user gets logged in thenull value will change

    //if every time any component will try to load this useEffect will be called

    useEffect(() => {    //user check logic
      
        const userId = localStorage.getItem('userId');
        if(userId) {
            setCurrentUser(userId); //user is currently logged in
        }
    }, []);    //it will not depend on any parameter [] is empty

    const value =  {
        currentUser, setCurrentUser   //value is set
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>         //so that if user login setCurrentUser can be called
}   