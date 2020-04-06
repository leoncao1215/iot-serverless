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
            sceneId     : 'ID-7363656e65-' + body.serialNumber,
            serialNumber: 'SN-7363656e65-' + body.serialNumber,
            sceneName   : body.sceneName,
            condition   : body.condition,
            operation   : body.operation,
        }
    };

    dynamodb.put(params, (err, data) => {
        if (err) {
            response.statusCode = 500;
            response.body       = JSON.stringify({
                code   : 500,
                message: "Unable to add scene. Error JSON:" + JSON.stringify(err, null, 2)
            });
        } else {
            response.statusCode = 200;
            response.body       = JSON.stringify({
                code   : 200,
                message: "Successfully add scene:" + JSON.stringify(data, null, 2)
            });
        }
        callback(null, response);
    })
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
