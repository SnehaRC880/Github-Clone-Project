const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    username : {
        type: String,
        required: true,
        unique: true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    repositories: [
        {
            default: [],
            type: Schema.Types.ObjectId,  //indicating that it is going to point to another object
            ref: "Repository", //(model)
        }
    ],
    followedUsers: [
        {
            default: [],
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    starRepositories: [
        {
            default: [],
            type: Schema.Types.ObjectId,
            ref: "Repository"
        }
    ]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;