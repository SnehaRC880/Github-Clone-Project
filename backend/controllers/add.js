const fs = require("fs").promises;
const path = require("path");

async function addRepo(filePath) {
   const repoPath = path.resolve(process.cwd(), ".apnaGit");  //the changes should be save in 
   const stagingPath = path.join(repoPath, "staging");

   try {
   await fs.mkdir(stagingPath, {recursive: true});
   const fileName = path.basename(filePath);  //read the name of file form the file path provided by user
   await fs.copyFile(filePath, path.join(stagingPath, fileName));
   console.log(`file ${fileName} added to staging area`);
} catch (error) {
   console.log("Error in adding file", error);
}
}
module.exports = { addRepo };

//we have to take the file from user and make a copy of it and add it to staging area

//command- node index.js add hello.txt