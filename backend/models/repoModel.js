const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RepositorySchema = new Schema ({
    Timestamps: true,          //add two fields every insertion deletion(created at and updated at)
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    content: [
        {
           type: String, 
        },
    ],
    visibility: {
        type: Boolean,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    issues: [
        {
          type: Schema.Types.ObjectId,
          ref: "Issue"  
        }
    ]
});

const Repository = mongoose.model("Repository", RepositorySchema);


module.exports = Repository;
