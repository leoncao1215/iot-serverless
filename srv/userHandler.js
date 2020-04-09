'use strict';

const util = require('./util');

/**
 * 查询所有用户
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.queryUserList = (event, context, callback) => {
    const dynamodb = require('./dynamodb');

    dynamodb.scan({TableName: 'user'}, (err, data) => {
        const response = {statusCode: null, body: null};
        if (err) {
            response.statusCode = 500;
            response.body       = JSON.stringify({code: 500, message: "ScanItem Error"});
        } else if ("Items" in data) {
            response.statusCode = 200;
            response.body       = JSON.stringify({users: data["Items"]});
        }
        callback(null, response);
    });
};

/**
 * 添加用户
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.addUser = (event, context, callback) => {
    const dynamodb = require('./dynamodb');

    const data = JSON.parse(event.body);

    const response = {statusCode: null, body: null};
    const params   = {
        TableName: 'user',
        Item     : {
            userId      :   data.userId||Math.random(10000000).toString(),
            userName    : data.userName,
            password    : data.password,
            disabled    :   data.disabled,
            authorized  :   data.authorized
        }
    };

    dynamodb.put(params, (err, res) => {
        if (err) {
            response.statusCode = 500;
            response.body       = JSON.stringify({
                code   : 500,
                message: "Unable to add user.json. Error JSON:" + JSON.stringify(err, null, 2)
            });
        } else {
            response.statusCode = 200;
            response.body       = JSON.stringify({
                code   : 200,
                message: "Successfully add user.json:" + JSON.stringify(res, null, 2)
            });
        }
        callback(null, response);
    })
};

/**
 * 删除用户
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.deleteUser = (event, context, callback) => {
    const userId = event.queryStringParameters.userId;

    const dynamodb = require('./dynamodb');
    dynamodb.delete({TableName: 'user', Key: {userId: userId}}, (err, data) => {
        const response = {statusCode: null, body: null};
        if (err) {
            response.statusCode = 500;
            response.body       = JSON.stringify({code: 500, message: "DeleteItem Error"});
        } else {
            response.statusCode = 200;
            response.body       = JSON.stringify({code: 200, message: "Successfully delete user."});
        }
        callback(null, response);
    });
};