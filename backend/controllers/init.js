const fs = require("fs").promises; //promise help to create file
const path = require("path");  //path gives path to curr working directory

async function initRepo() {
    const repoPath = path.resolve(process.cwd(), ".apnaGit"); //in "" there is folder name
    const commitPath = path.join(repoPath, "commits");

    try {  //folder creation can take time and we don;t know idf it is successfull or not that's why try and catch
      await fs.mkdir(repoPath, {recursive: true}); // rec: true if there is already a folder we can create another( nested structure)
      await fs.mkdir(commitPath, {recursive: true});  // ek saath ban jaaye both commit and init folder
      await fs.writeFile (
        path.join(repoPath, "config.json"), // json file created storing commit info 
        JSON.stringify({ bucket: process.env.S3_BUCKET })
      )
      console.log("Repository initialised");
    } catch (err) {
      console.log("Error Initialising repository", err);
    }
}

module.exports = { initRepo };

//command to write in console : node index.js init
//o/p .apnagit folder, commit folder and config.josn file created

//path.resolve gives current directory path