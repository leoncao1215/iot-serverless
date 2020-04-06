'use strict';

/**
 * 查询所有触发条件
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.queryCondList = (event, context, callback) => {
    const dynamodb = require('./dynamodb');

    const params = {
        TableName: 'cond',
    };
    dynamodb.scan(params, (err, data) => {
        console.log('asdas');
        const response = {statusCode: null, body: null};
        if (err) {
            response.statusCode = 500;
            response.body       = JSON.stringify({code: 500, message: err});
        } else if ("Items" in data) {
            response.statusCode = 200;
            response.body       = JSON.stringify({conds: data["Items"]});
        }
        callback(null, response);
    });
};
