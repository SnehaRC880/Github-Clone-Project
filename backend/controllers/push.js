const fs = require("fs").promises;
const path = require("path");   // to read the files that has to push to AWS
const {s3, S3_BUCKET} = require('../config/aws-config');

async function pushRepo() {
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const commitsPath = path.join(repoPath, "commits");   // there can be multiple commits folders

    try {
      
      const commitDirs = await fs.readdir(commitsPath);  //reading all commits folder
      for(const commitDir of commitDirs) {               //if there are 2 commits folder then 2 time loop will run
        const commitPath = path.join(commitsPath, commitDir);
        const files = await fs.readdir(commitPath); //reading the files in each commit directory(folder)
        
        for(const file of files) {
            const filePath = path.join(commitPath, file); //each file in each commit folder
            const fileContent = await fs.readFile(filePath);
            const params = {
                Bucket: S3_BUCKET,
                Key:`commits/${commitDir}/${file}`,
                Body: fileContent,
            };

            await s3.upload(params).promise();  //promise coz it is asynchronous code and can require time
        }
      }  

      console.log("All commits pushed to S3.");


    } catch(err) {
        console.error("Error pushing to S3: ", err);
    }
}

module.exports = { pushRepo };

//command - node index.js push
