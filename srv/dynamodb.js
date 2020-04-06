'use strict';

// const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
//
// const options = {
//     region: 'us-east-2',
//     endpoint: 'http://localhost:8000',
// };
//
// // // connect to local DB if running offline
// // if (process.env.IS_OFFLINE) {
// //   options = {
// //     region: 'us-east-1',
// //     endpoint: 'http://localhost:8000',
// //   };
// // }
//
// const client = new AWS.DynamoDB.DocumentClient(options);

let AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

const client = new AWS.DynamoDB.DocumentClient();

module.exports = client;
