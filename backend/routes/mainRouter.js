const express = require("express");
const userRouter = require("./userRouter");
const repoRouter = require("./repoRouter");
const issueRouter = require("./issueRouter");

const mainRouter = express.Router();

mainRouter.use(userRouter);
mainRouter.use(repoRouter);
mainRouter.use(issueRouter);

mainRouter.get("/", (req, res) => {
    res.send("Welcome!");
});

module.exports = mainRouter;