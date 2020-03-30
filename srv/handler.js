'use strict';

module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.world = (event, context, callback) => {
  var params = { TableName: "device" };

  console.log("Receive event:   " + JSON.stringify(event, null, 2));
  console.log("Receive context: " + JSON.stringify(context, null, 2));

  const dynamodb = require('./dynamodb');
  dynamodb.scan(params, (err, data) => {
      var response = {statusCode: null, body: null};
      if (err) {
          console.log(err);
          response.statusCode = 500;
          response.body = JSON.stringify({code: 500, message: "ScanItem Error"});
      } else if ("Items" in data) {
          response.statusCode = 200;
          response.body = JSON.stringify({users: data["Items"]});
      }
      callback(null, response);
  });
};
