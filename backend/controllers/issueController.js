const mongoose = require('mongoose');
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createIssue (req, res) {
    const {title, description} = req.body;     //issue is created inside repository. issue cannot exist without repository
    const { id } = req.params;    //repo id

    try {

      const issue = new Issue({
        title,
        description,
        repository: id,       //status will take default value
      });
      
      await issue.save();

      res.status(201).json({message:"Issue created successfully", issue});

    } catch(err) {
        console.error("Error during creating issue", err);
        res.status(500).send("Server Error");
    }
};

async function  updateIssueById (req, res) {
   const {id} = req.params;   //issue id

   const {title, description, status} = req.body;

   try {

    const issue = await Issue.findById(id);

    if(!issue) {
        return res.status(404).json({ error: "Issue not found"});
    }

    //if issue found
    issue.title = title;
    issue.description = description;
    issue.status = status;

    await issue.save();

    res.json({ message: "Issue updated successfully", issue});

   } catch(err) {
     console.error("Error during updating issue", err);
        res.status(500).send("Server Error");
   }
};

async function  deleteIssueById (req, res) {
   const { id } = req.params;

   try {

    const issue = await Issue.findByIdAndDelete(id);
     
    if(!issue) {
        return res.status(404).json({ error: "Issue not found"});
    }

    res.json({message: "Issue Deleted"});

   } catch(err) {
     console.error("Error during deleting issue", err);
     res.status(500).send("Server Error");
   }
};

async function  getAllIssues (req, res) {
   const {id}  = req.params;  //repoid

   try {

    const issues = await Issue.find({ repository: id });
    
    if(!issues) {
     return res.status(404).json({error: "Issues not found!"});
    }

    res.status(200).json(issues);

   }
   catch(err) {
     console.error("Error during fetching issues", err);
        res.status(500).send("Server Error");
   }
};

async function getIssueById (res, req) {
    const {id}  = req.params;  //repoid

   try {

    const issue = await Issue.findById(id);
    
    if(!issue) {
     return res.status(404).json({error: "Issue not found!"});
    }

    res.status(200).json(issue);

   }
   catch(err) {
     console.error("Error during fetching issue", err);
     res.status(500).send("Server Error");
   }
};

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById
}

