'use strict';
const dynamodb = require('./dynamodb');

/**
 * 添加单个场景
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.addScene = (event, context, callback) => {
    const body = JSON.parse(event.body);

    const response = {statusCode: null, body: null};
    const params   = {
        TableName: 'scene',
        Item     : {
            serialNumber: 'SN-7363656e65-' + body.serialNumber,
            sceneName   : body.sceneName,
            condType    : body.condType,
            cond        : body.cond,
            condDesc    : body.condDesc,
            device      : body.device,
            operation   : body.operation,
        }
    };

    console.log(params);

    callback(null, {
        statusCode : 200,
        body       : JSON.stringify('')
    });

    // dynamodb.put(params, (err, data) => {
    //     if (err) {
    //         response.statusCode = 500;
    //         response.body       = JSON.stringify({
    //             code   : 500,
    //             message: "Unable to add scene. Error JSON:" + JSON.stringify(err, null, 2)
    //         });
    //     } else {
    //         response.statusCode = 200;
    //         response.body       = JSON.stringify({
    //             code   : 200,
    //             message: "Successfully add scene:" + JSON.stringify(data, null, 2)
    //         });
    //     }
    //     callback(null, response);
    // })
};

/**
 * 通过 SN 查询场景
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.querySceneBySN = (event, context, callback) => {
    const serialNumber = event.queryStringParameters.serialNumber;

    const params = {
        TableName: 'scene',
        KeyConditionExpression: 'serialNumber=:SN',
        ExpressionAttributeValues: {
            ':SN': serialNumber
        }
    };
    dynamodb.query(params, (err, data) => {
        const response = {statusCode: null, body: null};
        if (err) {
            response.statusCode = 500;
            response.body       = JSON.stringify({code: 500, message: err});
        } else if ("Items" in data) {
            response.statusCode = 200;
            response.body       = JSON.stringify({scene: data["Items"][0]});
        }
        callback(null, response);
    });
};

/**
 * 通过 Condition Type 查询场景
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.querySceneListByType = (event, context, callback) => {
    const condType = event.queryStringParameters.condType;

    const params = {
        TableName: 'scene',
        FilterExpression: '#TYPE = :TYPE',
        ExpressionAttributeNames: {
            "#TYPE": "condType",
        },
        ExpressionAttributeValues: {
            ':TYPE': condType
        }
    };
    dynamodb.scan(params, (err, data) => {
        const response = {statusCode: null, body: null};
        if (err) {
            response.statusCode = 500;
            response.body       = JSON.stringify({code: 500, message: err});
        } else if ("Items" in data) {
            response.statusCode = 200;
            response.body       = JSON.stringify({scenes: data["Items"]});
        }
        callback(null, response);
    });
};

/**
 * 查询所有场景
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.querySceneList = (event, context, callback) => {
    const params = {
        TableName: 'scene',
    };
    dynamodb.scan(params, (err, data) => {
        const response = {statusCode: null, body: null};
        if (err) {
            response.statusCode = 500;
            response.body       = JSON.stringify({code: 500, message: err});
        } else if ("Items" in data) {
            response.statusCode = 200;
            response.body       = JSON.stringify({scenes: data["Items"]});
        }
        callback(null, response);
    });
};
