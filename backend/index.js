const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init.js");
const { addRepo } = require("./controllers/add.js");
const { pushRepo } = require("./controllers/push.js");
const { pullRepo } = require("./controllers/pull.js");
const { revertRepo } = require("./controllers/revert.js");
const { commitRepo } = require("./controllers/commit.js");

yargs(hideBin(process.argv))
.command("init", "Initialise a new Repository", {}, initRepo) //{} => parameters empty for init

.command("add <file>", "Add a file to the repository", (yargs) => {yargs.positional("file", {   //<file> parameter in brackets
    describe: "File to add to staging area",
    type: "string",
})}, (argv) => {
    addRepo(argv.file)}
)

.command("commit <message>", "Commit the staged files", (yargs) => {yargs.positional("message", {
    describe: "Commit message",
    type: "string",
})}, (argv) => {
     commitRepo(argv.message)
})

.command("push", "push commit to S3", {}, pushRepo)

.command("pull", "pull commits from S3", {}, pullRepo)

.command("revert <commitID>", "Revert to a specific commit", (yargs) => {yargs.positional("commitId", {
    describe: "commit Id to revert to",
    type: "string"
});
}, 
(argv) => {
revertRepo(argv.commitID);
 }
)
.demand(1, "you need atleast one command")
.help().argv;