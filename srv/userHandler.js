'use strict';

const util = require('./util');

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
            userId  :   data.userId||Math.random(10000000).toString(),
            userName  : data.userName,
            password: data.password,
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