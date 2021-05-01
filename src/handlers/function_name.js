var AWS = require('aws-sdk');
AWS.config.apiVersions = {
    sqs: '2012-11-05',
    ses: '2010-12-01',
    // other service API versions
};

/*
Add some description here
*/
exports.handler = async (event, context, callback) => {

    console.log(context);
    console.log(event);

    //this sets the function to exit immediately after the cappback is executed
    //instead of waiting for the Node.js event loop to be empty
    //https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html

    context.callbackWaitsForEmptyEventLoop = false;

    var response = {
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "isBase64Encoded": false
    }

    var body = JSON.parse(event.body)

    console.log(body)

    callback(null, response);
};