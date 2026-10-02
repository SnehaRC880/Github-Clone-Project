const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {MongoClient, ReturnDocument} = require("mongodb");
const dotenv = require("dotenv");
var objectId = require("mongodb").ObjectId;  //when we fetch id from frontend(api) then this package concert id into mongodb format

dotenv.config(); //initialise
const uri = process.env.MONGO_DB_URL;

let client;     //connection establish

async function connectClient() {
    if(!client) {   //is not connected
        // client = new MongoClient(uri, {
        //     useNewUrlParser: true, 
        //     useUnifiedTopology: true
        // });
        client = new MongoClient(uri);
        await client.connect();  //wait till connection gets establish
    }
}

async function signup (req, res) {
    const {username, email, password } = req.body;  //destructure
    try {
        await connectClient();
        const db = client.db("githubclone");           //access github(name) database
        const usersCollection = db.collection("users");  //collection will be created if not there

        const user = await usersCollection.findOne({ username });

        if(user) {  //user found
          return res.status(400).json({message: "User already exists"})
        }
        
        //is user not exist then create
        const salt = await bcrypt.genSalt(10);   //10 ->encrytion will run 10 times to reach secured setup(password)
        const hashedPassword = await bcrypt.hash(password, salt);  //encrypting the password given by user

        const newUser = {
            username,
            password: hashedPassword,
            email,
            repositories: [],
            followedUsers: [],
            starRepos: []
        }

        const result = await usersCollection.insertOne(newUser);

        //if user is successfully created then new token is generated
        const token = jwt.sign({id: result.insertId}, process.env.JWT_SECRET_KEY, {expiresIn: "1h"})  //expires in one hour

        res.json({token});

    } catch(err) {
       console.error("Error during signup: ", err.message);
       res.status(500).send("Server error");
    }
}

async function login (req, res)  {
    const {email, password} = req.body;
    try {
      await connectClient();
      const db = client.db("githubclone");           //access github(name) database
      const usersCollection = db.collection("users"); 
      
      const user = await usersCollection.findOne({ email });
      if(!user) {
        return res.status(400).json({message: "Invalid credentials"});
      }

      const isMatch = await bcrypt.compare(password, user.password); //comaparing password that came frpm user with database password
      if(!isMatch) {
        return res.status(400).json({ message: "Invalid credentials"});
      }

      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1h"});
      res.json({token, userId: user._id});  //token and user id is return
    }  catch (err) {
        console.err("Error during login: ", err);
        res.status(500).send("Server Error!");
    }
}

async function getAllUsers (req, res)  {
    try {
      await connectClient();
      const db = client.db("githubclone");
      const usersCollection = db.collection("users");

      const users = await usersCollection.find({}).toArray();   //it returns array which cannot be converted to json(error) -> Coverting circular structure to json so write .toArray 
      res.json(users);

    } catch (err) {
        console.error("Error during fetching", err);
        res.status(500).send("Server error");
    }
}

async function getUserProfile (req, res) {
    const currentID = req.params.id;

    try {

      await connectClient();
      const db = client.db("githubclone");
      const usersCollection = db.collection("users");

      const user = await usersCollection.findOne({
         _id: new objectId(currentID)    //_id is there in database //currentId(string) is taken from user or coming from request as a paramter is converted into objectId in the format stored in database 
      })

      if(!user) {
        return res.status(404).json({message: "User not found"});
      }  

      res.status(200).send({message: "profile fetched!", user:user});

    } catch(err) {
       console.error("Error during fetching", err.message);
        res.status(500).send("Server error");
    }

}

// async function updateUserProfile (req, res) {
//     const currentID = req.params.id;           //user logged in
//     const {email, password} = req.body;

//     try {

//       await connectClient();
//       const db = client.db("githubclone");
//       const usersCollection = db.collection("users");   

//      let updateFields = {email}; 
//      if(password) {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);
//         updateFields.password = hashedPassword;
//      }  

//      const result = await usersCollection.findOneAndUpdate({
//         _id: new objectId(currentID)
//     }, {$set: updateFields}, {returnDocument: "after"}); 

    //  if(!result.value) {   //agar result se koi value return nai hoti hai
    //     return res.status(404).json({message: "User not found!"});
    //  }

    //  res.send(result.value); // if result return value then user will be able to see the result updated object

//      if (!result) {
//             return res.status(404).json({
//                 message: "User not found!"
//             });
//         }

//         return res.status(200).json({
//             message: "Profile updated successfully!",
//             user: result
//         });

//     } catch(err) {
//         console.error("Error during updating", err.message);
//         res.status(500).send("Server error"); 
//     }
// }

async function updateUserProfile(req, res) {
    const currentID = req.params.id;
    const { email, password } = req.body;

    try {
        await connectClient();

        const db = client.db("githubclone");
        const usersCollection = db.collection("users");

        let updateFields = {};

        if (email) {
            updateFields.email = email;
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }

        const result = await usersCollection.findOneAndUpdate(
            {
                _id: new objectId(currentID)
            },{ $set: updateFields },{ returnDocument: "after"}
        );

        console.log("RESULT:", result);

        if (!result) {
            return res.status(404).json({
                message: "User not found!"
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully!",
            user: result
        });

    } catch (err) {
        console.error("Error during updating:", err.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
}

async function deleteUserProfile (req, res) {
     const currentID = req.params.id;  

     try {

        await connectClient();
      const db = client.db("githubclone");
      const usersCollection = db.collection("users");
      
       const result = await usersCollection.deleteOne({
         _id: new objectId(currentID)
       });

       if(result.deleteCount == 0) {  //deletion 0 hai means deletion nahi hua hai user not found
         return res.status(404).json({message: "User not found!"});
       }

       res.json({message: "User profile deleted"});

     } catch(err) {
         console.error("Error during deleting", err.message);
        res.status(500).send("Server error"); 
     }
}

module.exports = {
    getAllUsers, 
    signup, 
    login, 
    getUserProfile, 
    updateUserProfile, 
    deleteUserProfile
};


//to create a repo we need a user and to create issues we need repo
// json web token(JWT) create a token which is stored on browser
//token gets renewed //is user visits website within 7 days supppose then token gets renewed(valid) for more 7 days from that day.
// token expires if user not visits within 7 days and visits after 7 days user need to login again andthen token is again issued for milited duration
//bcrypt is used to encrypt the password
//mongoDb package

//login
//step 1 - connection establish
//step 2 -  find user check credentails
//step 3 - check token is valid or not // if not then recreate the token if valid then good and extend the duration
// expiry should in hour