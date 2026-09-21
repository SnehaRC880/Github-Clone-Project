require("dotenv").config();

const AWS = require('aws-sdk');

AWS.config.update({ 
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: "ap-south-1" 

});

const s3 = new AWS.S3();

const S3_BUCKET = process.env.S3_BUCKET_NAME;

module.exports = { s3, S3_BUCKET };






























// {
//     "Version": "2012-10-17",
//     "Statement": [
//         {
//             "Effect": "Allow",
//             "Principal": {
//                 "AWS": "arn:aws:iam::896138900994:user/demouser"
//             },
//             "Action": "s3:*",
//             "Resource": [
//                 "arn:aws:s3:::github--s3--bucket",
//                 "arn:aws:s3:::github--s3--bucket/*"
//             ]
//         }
//     ]
// }