'use strict';

const util = require('./util');

const dynamodb = require('./dynamodb');
/**
 * 查询使用历史
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.queryHistoryList = (event, context, callback) => {

    dynamodb.scan({TableName: 'history'}, (err, data) => {
        const response = {statusCode: null, body: null};
        if (err) {
            response.statusCode = 500;
            response.body       = JSON.stringify({code: 500, message: "ScanItem Error"});
        } else if ("Items" in data) {
            response.statusCode = 200;
            response.body       = JSON.stringify({historyList: data["Items"]});
        }
        callback(null, response);
    });
};


/**
 * 通过设备查询对应历史记录
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.queryHistoryListByDevice = (event, context, callback) => {
    const curDevice = event.queryStringParameters.device;

    const params = {
        TableName: 'history',
        FilterExpression: '#TYPE = :TYPE',
        ExpressionAttributeNames: {
            "#TYPE": "device",
        },
        ExpressionAttributeValues: {
            ':TYPE': curDevice
        }
    };
    dynamodb.scan(params, (err, data) => {
        const response = {statusCode: null, body: null};
        if (err) {
            response.statusCode = 500;
            response.body       = JSON.stringify({code: 500, message: err});
        } else if ("Items" in data) {
            response.statusCode = 200;
            response.body       = JSON.stringify({historyList: data["Items"]});
        }
        callback(null, response);
    });
};

/**
 * 通过日期查询对应历史记录
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.queryHistoryByDate = (event, context, callback) => {
    const curDate = event.queryStringParameters.date;

    const params = {
        TableName: 'history',
        FilterExpression: '#TYPE = :TYPE',
        ExpressionAttributeNames: {
            "#TYPE": "day",
        },
        ExpressionAttributeValues: {
            ':TYPE': curDate
        }
    };
    dynamodb.scan(params, (err, data) => {
        const response = {statusCode: null, body: null};
        if (err) {
            response.statusCode = 500;
            response.body       = JSON.stringify({code: 500, message: err});
        } else if ("Items" in data) {
            response.statusCode = 200;
            response.body       = JSON.stringify({historyList: data["Items"]});
        }
        callback(null, response);
    });
};

/**
 * 删除历史记录
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.deleteHistory = (event, context, callback) => {
    const historyId = event.queryStringParameters.historyId;

    dynamodb.delete({TableName: 'history', Key: {historyId: historyId}}, (err, data) => {
        const response = {statusCode: null, body: null};
        if (err) {
            response.statusCode = 500;
            response.body       = JSON.stringify({code: 500, message: "DeleteItem Error"});
        } else {
            response.statusCode = 200;
            response.body       = JSON.stringify({code: 200, message: "Successfully delete History."});
        }
        callback(null, response);
    });
};
