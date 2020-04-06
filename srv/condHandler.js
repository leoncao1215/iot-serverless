'use strict';

const util = require('./util');

/**
 * 查询所有触发条件
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.queryCondList = (event, context, callback) => {
    const dynamodb = require('./dynamodb');

    dynamodb.scan({TableName: 'cond'}, (err, data) => {
        const response = {statusCode: null, body: null};
        if (err) {
            response.statusCode = 500;
            response.body       = JSON.stringify({code: 500, message: "ScanItem Error"});
        } else if ("Items" in data) {
            response.statusCode = 200;
            response.body       = JSON.stringify({scenes: data["Items"]});
        }
        callback(null, response);
    });
};
