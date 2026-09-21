const fs = require("fs").promises;
const path = require("path");
const {v4: uuidv4} = require("uuid");

async function commitRepo(message) {
   const repoPath = path.resolve(process.cwd(), ".apnaGit");
   const stagingPath = path.join(repoPath, "staging");
   const commitPath = path.join(repoPath, "commits");

   try {
     const commitId = uuidv4();
     const commitDir = path.join(commitPath, commitId);  
     await fs.mkdir(commitDir, {recursive: true});  //folder inside commits created with same name as commit id 

     const files = await fs.readdir(stagingPath);  //read all files available in staging folder
     for(const file of files) {  //for of loop
        await fs.copyFile(path.join(stagingPath, file), path.join(commitDir, file));
     }
     await fs.writeFile(path.join(commitDir, "commit.json"), //(kaha pe file ko banana hai, file ka namm)
        JSON.stringify({message, date: new Date().toISOString()}) // help to convert javascript to json
     );
     console.log(`commit ${commitId} with message ${message}`);
   } catch (err) {
    console.error("Error Commiting files", err);
   }
}

module.exports = { commitRepo };

//command - node index.js commit "first commit"
//o/p commit 387382832382 created with message: fisrt commit