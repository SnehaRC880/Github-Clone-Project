const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require('body-parser') //help to read data coming from request and send data in response 
const http = require("http");
const {Server} = require("socket.io");
const mainRouter = require("./routes/mainRouter.js")


dotenv.config(); // will enable in process

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init.js");
const { addRepo } = require("./controllers/add.js");
const { pushRepo } = require("./controllers/push.js");
const { pullRepo } = require("./controllers/pull.js");
const { revertRepo } = require("./controllers/revert.js");
const { commitRepo } = require("./controllers/commit.js");

yargs(hideBin(process.argv))
.command("start", "Starts a new server", {}, startServer)
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

function startServer() {
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(bodyParser.json());
    app.use(express.json());

    const mongoURI = process.env.MONGO_DB_URL;

    mongoose.connect(mongoURI)
        .then(() => console.log("MongoDB connected!"))
        .catch((err) => console.error("Unable to connect : ", err));
    
        app.use(cors({ origin:"*" }));

        app.use("/", mainRouter);

        let user = "demo" //temporary user

       const httpServer = http.createServer(app);
       const io = new Server(httpServer, { // Server use from socket.io
         cors: {
            origin: "*",
            methods: ["GET", "POST"],
         },   
    })

    io.on("connection", (socket) => { //when the socket gets on or triggered we have to establish a connection
        socket.on("joinRoom", (userID) => {     // we want to add the user to connection //anybody who is logged in should able to access this socket
          user = userID;
          console.log("=====");
          console.log(user);
          console.log("=====");
          socket.join(userID);
        });
    });

    const db = mongoose.connection;

    db.once("open", async() => {  //initial fetch
       console.log("CRUD operations called"); 
       //CRUD operations
    });
    
    httpServer.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
}

//Socket.io => contiues connection and updates to user(live)
// cors * => request can be accepted from any location or url and is treated as a valid path ( security concern will be overide and all request will be allowed)