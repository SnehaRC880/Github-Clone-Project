const mongoose = require('mongoose');
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createRepository (req, res) {
    const {owner, name, issues, content, description, visibility} = req.body;

    try {
    
     if(!name) {
        return res.status(400).json({error: "Repository name is required"});
     }   

     if(!mongoose.Types.ObjectId.isValid(owner)) {   //if owner is valid mongodb object then it will return true otherwise false
        return res.status(400).json({error: "Invalid user Id"}); //we counld find the account with this name or id
     }

      const newRepository = new Repository({
        name,                             //suppose while destructing we have wriiten userId instead of owner then we can write here like this owner: userId
        description, 
        visibility, 
        owner, 
        content, 
        issues,
      });

      const result = await newRepository.save();
       
      res.status(201).json({message: "Repository created", repositoryID: result._id});

    } catch(err) {
        console.error("error during repository creation =  ", err);
        res.status(500).send("Server error");
    }
}

async function getAllRepositories (req, res) {   //general or public functionality
   try {

    const repositories = await Repository.find({}).populate("owner").populate("issues");  //while fetchinbg the repository details we don;t want only owner id as owner id is store in database we want details(data) of owner so we use populate 

    res.json(repositories);

   } catch(err) {
        console.error("error during fetching repositories =  ", err);
        res.status(500).send("Server error");
   }
}

async function fetchRepositoryById (req, res) {
   const { id } = req.params;
 
   try {

    const repository = await Repository.find({ _id: id}).populate("owner").populate("issues"); //_id is store in mongoDb
    
    if(!repository) {
        res.json({message:"No repository found"});
    }
    res.json(repository);
   } catch(err) {
        console.error("error during fetching repository =  ", err);
        res.status(500).send("Server error");
   }
}

async function fetchRepositoryByName (req, res) {
     const { name } = req.params;
 
   try {

    const repository = await Repository.find({ name }).populate("owner").populate("issues"); //_id is store in mongoDb
    
    if(!repository) {
        res.json({message:"No repository found"});
    }
    res.json(repository);
   } catch(err) {
        console.error("error during fetching repository =  ", err);
        res.status(500).send("Server error");
   }
}

async function fetchRepositoriesForCurrentUser (req, res) {     //below all functions can be access only wen user loggedin
    const userId = req.user;    //if user is logges in then its id and token will be return which be there in req.user
    
    try {

     const repositories = await Repository.find({ owner: userId});  
     
     if(!repositories || repositories.length == 0) {
        return res.status(404).json({error: "User Repository not found"});
     }

     res.json({message: "Repositories found!", repositories});

    } catch(err) {
        console.error("error during fetching user repository =  ", err);
        res.status(500).send("Server error");
   }
}

async function updateRepositoryById (req, res)  {
   const {id} = req.params;

   const {content, description} = req.body;

   try {

    const repository = await Repository.findById(id);

    if(!repositories || repositories.length == 0) {
        return res.status(404).json({error: "Repository not found"});
     }

     repository.content.push(content);
     repository.description = description;

     const updatedRepository = await repository.save();

     res.json({ message: "Repository updated successfully", repository: updatedRepository });

   } catch(err) {
        console.error("error during updating repository =  ", err);
        res.status(500).send("Server error");
   }
}

async function toggleVisibilityById (req, res) {
       const {id} = req.params;

   const {content, description} = req.body;

   try {

    const repository = await Repository.findById(id);

    if(!repositories || repositories.length == 0) {
        return res.status(404).json({error: "Repository not found"});
     }

     repository.visibility = !repository.visibility;

     const updatedRepository = await repository.save();

     res.json({ message: "Repository visibility toggled successfully", repository: updatedRepository });

   } catch(err) {
        console.error("error during togglng visibility repository =  ", err);
        res.status(500).send("Server error");
   }
}

async function deleteRepositoryById (req, res) {
    const {id} = req.params;

    try {

     const repository = await Repository.findByIdAndDelete(id);   
     
     if(!repository) {
        return res.status(404).json({error: "Repository not found"});
     }

     res.json({ message:"Repository Deleetd successfully!"})

    } catch(err) {
        console.error("error during togglng visibility repository =  ", err);
        res.status(500).send("Server error");
   }
}

module.exports = {
    createRepository,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoriesForCurrentUser,
    getAllRepositories,
    updateRepositoryById,
    deleteRepositoryById,
    toggleVisibilityById
}

