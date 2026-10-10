import React, {useState, useEffect} from 'react'
import "./dashboard.css"
import Navbar from '../Navbar';

const Dashboard = () => {

   const [repositories, setRepositories] = useState([]);
   const [searchQuery, setSearchQuery] = useState("");
   const [suggestedRepositories, setSuggestRepositories] = useState([]);
   const [searchResults, setSearchResults] = useState([]);

   useEffect(() => {     //useEffect for data fetch and searching
      const userId = localStorage.getItem("userId");
      
      const fetchRepositories = async() => { //userSpecific
       try {
      const response = await fetch(`http://localhost:3000/repo/user/${userId}`);
      const data = await response.json();
      setRepositories(data.repositories);
   }  catch(err) {
        console.error("Error while fetching repositories", err);
      }
   };

   const fetchSuggestedRepositories = async() => { //userSpecific
       try {
      const response = await fetch(`http://localhost:3000/repo/all`);
      const data = await response.json();
      setSuggestRepositories(data);
      console.log(data);
   }  catch(err) {
        console.error("Error while fetching repositories", err);
      }
   };
   fetchRepositories();
   fetchSuggestedRepositories();
}, [])

useEffect(() => {

   if(searchQuery == "") {
      setSearchResults(repositories);  //agar kuch bhi search nahi kiya hai to sabkuch dikhana hai
   } else {
      const filteredRepo = repositories.filter((repo) => repo.name.toLowerCase().includes(searchQuery.toLowerCase()));  //if repository name matches with search query then show only that repositories(match ones)
      setSearchResults(filteredRepo);
   }

},[searchQuery, repositories])


    return ( 
      <>
      <Navbar/>
       <section id='dashboard'>
         <aside>
            <h3>Suggested Repositories</h3>
            {suggestedRepositories.map((repo) => {
               return (
                <div key={repo._id}>
                  <h4>{repo.name}</h4>
                  <h4>{repo.description}</h4>
                </div>
               )
            })}
         </aside>
         <main>
            <h3>Your Repositories</h3>
            <div id="Search">
              <input type="text" value={searchQuery} placeholder='Search...'
                onChange={(e) => setSearchQuery(e.target.value)}/>
            </div>
            {searchResults.map((repo) => {
               return (
                <div key={repo._id}>
                  <h4>{repo.name}</h4>
                  <h4>{repo.description}</h4>
                </div>
               )
            })}
         </main>
         <aside>
            <h3>Upcoming Events</h3>
            <ul>
               <li><p>Tech Conference - Dec 15</p></li>
               <li><p>Developer MeetUp - Jan 13</p></li>
               <li><p>React Summit - July 2</p></li>
            </ul>
         </aside>
       </section>
       </>
     );
}

export default Dashboard;


//left panel - all repo (suggested) not relevance to user(public repo)
//middle panel - search bar (current logged in user repo)
//right panel - dumy data(upcoming events)(updates)