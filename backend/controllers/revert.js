const fs = require('fs');
const path = require('path');
const { promisify } = require("util"); //package in node preinstalll(internal api of node- allow us to check for existing things)

const readdir = promisify(fs.readdir); //it can read only when dir exist
const copyFile = promisify(fs.copyFile); // if the file with commit id exits then that file is copied in parent directory

async function revertRepo(commitID) {
   const repoPath = path.resolve(process.cwd(), ".apnaGit");
   const commitsPath = path.join(repoPath, "commits");

   try {
     const commitDir = path.join(commitsPath, commitID);
     const files = await readdir(commitDir); // read the commitdir provided by user
     const parentDir = path.resolve(repoPath, "..");
     
     for(const file of files) {
        await copyFile(path.join(commitDir, file), path.join(parentDir, file)); //copying from commits folder to parent folder 
     }
     
     console.log(`Commit ${commitID} reverted successfully`);

   } catch(err) {
      console.error("Unable to revert: ", err);
   }
}

module.exports = { revertRepo };

// command : node index.js revert {commitId}
//if we deleted any commited file that is push to s3 from our main folder 
// then that file can be get back using revert command