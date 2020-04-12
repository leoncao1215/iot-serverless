'use strict';
const dynamodb = require('./dynamodb');
const condHandler = require('./condHandler');
const deviceHandler = require('./deviceHandler');

let trigger = null;
let conds = [];
let scenes = [];

const label = {
    time       : '0',
    brightness : '1',
    temperature: '2'
}
let num = {
    time       : 0,
    brightness : 0,
    temperature: 0
}

const Control = {
    update: 0,
    delete: 1,
    use   : 2
}

const CondType = {
    time       : 'time',
    brightness : 'brightness',
    temperature: 'temperature'

}

/**
 * 添加单个场景
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.addScene = (event, context, callback) => {
    const body = JSON.parse(event.body);
    let serialNumber = 'SN-7363656e65-' + label[body.condType];
    if (num[body.condType] < 9) { serialNumber += '0'; }
    serialNumber += num[body.condType] + 1

    const response = {statusCode: null, body: null};
    const params   = {
        TableName: 'scene',
        Item     : {
            serialNumber: serialNumber,
            sceneName   : body.sceneName,
            condType    : body.condType,
            cond        : body.cond,
            condDesc    : body.condDesc,
            device      : body.device,
            deviceName  : body.deviceName,
            operation   : body.operation,
            isUsing     : body.isUsing
        }
    };

    dynamodb.put(params, (err, data) => {
        if (err) {
            response.statusCode = 500;
            response.body       = JSON.stringify({
                code   : 500,
                message: 'Unable to add scene. Error JSON:' + JSON.stringify(err, null, 2)
            });
        } else {
            response.statusCode = 200;
            response.body       = JSON.stringify({
                code   : 200,
                message: 'Successfully add scene.'
            });
            num[body.condType] += 1;
            if (body.condType === CondType.time) { SceneCheck(Control.update); }
        }
        callback(null, response);
    })
};

/**
 * 通过 SerialNumber 查询场景
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
        } else if ('Items' in data) {
            response.statusCode = 200;
            response.body       = JSON.stringify({scene: data['Items'][0]});
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
            '#TYPE': 'condType',
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
        } else if ('Items' in data) {
            response.statusCode = 200;
            response.body       = JSON.stringify({scenes: data['Items']});
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
    if (trigger === null) {
        SceneCheck();
        countScene();
    }

    const params = {
        TableName: 'scene',
    };
    dynamodb.scan(params, (err, data) => {
        const response = {statusCode: null, body: null};
        if (err) {
            response.statusCode = 500;
            response.body       = JSON.stringify({code: 500, message: err});
        } else if ('Items' in data) {
            response.statusCode = 200;
            response.body       = JSON.stringify({scenes: data['Items']});
        }
        callback(null, response);
    });
};

/**
 * 更新场景
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.updateScene = (event, context, callback) => {
    const body = JSON.parse(event.body);

    const params = {
        TableName: 'scene',
        Key: {
            'serialNumber': body.serialNumber,
        },
        UpdateExpression: `SET sceneName=:sceneName, condType=:condType, cond=:cond, condDesc=:condDesc, 
                               device=:device, operation=:operation, isUsing=:isUsing`,
        ExpressionAttributeValues: {
            ':sceneName' : body.sceneName,
            ':condType'  : body.condType,
            ':cond'      : body.cond,
            ':condDesc'  : body.condDesc,
            ':device'    : body.device,
            ':operation' : body.operation,
            ':isUsing'   : body.isUsing
        },
    };
    dynamodb.update(params, (err, data) => {
        const response = {statusCode: null, body: null};
        if (err) {
            response.statusCode = 500;
            response.body       = JSON.stringify({code: 500, message: err});
        } else {
            response.statusCode = 200;
            response.body       = JSON.stringify({
                code   : 200,
                message: `Successfully update scene: ${body.serialNumber}.`
            });
            if (body.condType === CondType.time) { SceneCheck(Control.update); }
        }
        callback(null, response);
    });
};

/**
 * 使用或不使用场景
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.updateSceneUsing = (event, context, callback) => {
    const body = JSON.parse(event.body);
    const serialNumber = body.serialNumber;

    const params = {
        TableName: 'scene',
        Key: {
            'serialNumber': serialNumber,
        },
        UpdateExpression: `SET isUsing=:isUsing`,
        ExpressionAttributeValues: {
            ':isUsing': body.isUsing
        },
        ReturnValues: 'UPDATED_NEW'
    };
    dynamodb.update(params, (err, data) => {
        const response = {statusCode: null, body: null};
        if (err) {
            response.statusCode = 500;
            response.body       = JSON.stringify({code: 500, message: err});
        } else {
            response.statusCode = 200;
            response.body       = JSON.stringify({
                code   : 200,
                message: `Successfully update scene using: ${body.serialNumber}, ${data}.`
            });
            SceneCheck(Control.use, serialNumber, body.isUsing);
        }
        callback(null, response);
    });
};


/**
 * 删除场景
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.deleteScene = (event, context, callback) => {
    const serialNumber = event.queryStringParameters.serialNumber;
    const params = {
        TableName: 'scene',
        Key      : {'serialNumber': serialNumber},
    };

    dynamodb.delete(params, (err, data) => {
        const response = {statusCode: null, body: null};
        if (err) {
            response.statusCode = 500;
            response.body       = JSON.stringify({code: 500, message: err});
        } else {
            response.statusCode = 200;
            response.body       = JSON.stringify({code: 200, message: 'Successfully delete scene.'});
            countScene();
            SceneCheck(Control.delete, serialNumber);
        }
        callback(null, response);
    });
};









/**
 * 按照 type 查询所有场景
 *
 * @param type
 */
module.exports.querySceneListByTypeInner = async (type) => {
    const params = {
        TableName: 'scene',
        FilterExpression: '#TYPE = :TYPE',
        ExpressionAttributeNames: {
            "#TYPE": "condType",
        },
        ExpressionAttributeValues: {
            ':TYPE': type
        }
    };
    let res = await dynamodb.scan(params).promise();
    if ("Items" in res) { return res.Items; }
    else { return null; }
}


async function countScene(typeT) {
    for (let type in CondType) {
        if (!typeT || type === typeT) {
            num[type] = await module.exports.querySceneListByTypeInner(type).then(data => {
                let count = 0;
                data.map(scene => {
                    let n = parseInt(scene.serialNumber.slice(-2));
                    if (n > count) { count = n; }
                });
                return count;
            });
        }
    }
    console.log(num);
}


async function SceneCheck(control, sceneSN, isUsing) {
    // if (conds === null || conds.length === 0) {
    //     conds = await condHandler.queryCondListByTypeInner('time');
    //     conds.forEach(cond => cond.time = cond.hour * 100 + cond.minute);
    // }

    if (scenes === null ||  scenes.length === 0 || control === Control.update) {
        scenes = await module.exports.querySceneListByTypeInner('time');
        scenes.forEach(scene => scene.time = parseInt(scene.cond.slice(-4)));
        scenes = scenes.sort((a, b) => a.time - b.time);
    }

    if (trigger === null) {
        trigger = setInterval(() => {
            console.log(`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}  Trigger is searching trigger scene every 15s ...`)
            if (scenes.length > 0) {
                const now = new Date().getHours() * 100 + new Date().getMinutes();
                scenes.forEach(scene => {
                    if (scene.isUsing && now === scene.time) {
                        const param = {
                            queryStringParameters: {
                                targetDevice: scene.device,
                                action: scene.operation === 'turn on' ? 'turnOn' : 'turnOff'
                            }
                        }
                        console.log(`Trigger find one : ${param}`);
                        deviceHandler.controlDevice(param, null, (a, b) => console.log(a, b));
                    }
                })
            }
        }, 15000);
    }

    if (control === Control.delete && sceneSN) {
        for (let i = 0; i < scenes.length; i++) {
            if (scenes[i].serialNumber === sceneSN) {
                scenes.splice(i, 1);
                break;
            }
        }
    } else if (control === Control.use && sceneSN && isUsing) {
        for (let i = 0; i < scenes.length; i++) {
            if (scenes[i].serialNumber === sceneSN) {
                scenes[i].isUsing = isUsing;
                break;
            }
        }
    }
}
