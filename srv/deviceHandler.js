'use strict';

const util = require('./util');

/**
 * 添加单个设备
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.addDevice = (event, context, callback) => {
  const dynamodb = require('./dynamodb');

  const body = JSON.parse(event.body);

  const response = {statusCode: null, body: null};
  const params   = {
    TableName: 'device',
    Item     : {
      clientId    : body.clientId,
      serialNumber: body.serialNumber,
      deviceName  : body.deviceName,
      type        : body.type,
      disabled    : body.disabled || false,
      down        : body.down || false
    }
  };

  dynamodb.put(params, (err, data) => {
    if (err) {
      response.statusCode = 500;
      response.body       = JSON.stringify({
        code   : 500,
        message: "Unable to add device. Error JSON:" + JSON.stringify(err, null, 2)
      });
    } else {
      response.statusCode = 200;
      response.body       = JSON.stringify({
        code   : 200,
        message: "Successfully add device:" + JSON.stringify(data, null, 2)
      });
    }
    callback(null, response);
  })
};

/**
 * 批量添加设备
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.batchAddDevice = (event, context, callback) => {
  const dynamodb  = require('./dynamodb');
  const devices   = JSON.parse(event.body).devices;
  const response  = {statusCode: null, body: null};
  const errorList = [];
  let cnt         = devices.length;

  devices.forEach(device => {
    const params = {
      TableName: 'device',
      Item     : {
        clientId    : device.clientId,
        serialNumber: device.serialNumber,
        deviceName  : device.deviceName,
        type        : device.type,
        disabled    : device.disabled || false,
        down        : device.down || false
      }
    };

    dynamodb.put(params, (err, data) => {
      if (err) {
        errorList.push(params['Item']);
      }
      --cnt;
      if (cnt <= 0) {
        if (errorList.length !== 0) {
          response.statusCode = 500;
          response.body       = JSON.stringify({
            code   : 500,
            message: "Fail to add devices: " + JSON.stringify(errorList)
          });
        } else {
          response.statusCode = 200;
          response.body       = JSON.stringify({devices: devices});
        }
        callback(null, response);
      }
    })
  });
};

/**
 * 查询所有设备
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.queryDeviceList = (event, context, callback) => {
  const dynamodb = require('./dynamodb');

  dynamodb.scan({TableName: 'device'}, (err, data) => {
    const response = {statusCode: null, body: null};
    if (err) {
      response.statusCode = 500;
      response.body       = JSON.stringify({code: 500, message: "ScanItem Error"});
    } else if ("Items" in data) {
      response.statusCode = 200;
      response.body       = JSON.stringify({devices: data["Items"]});
    }
    callback(null, response);
  });
};

/**
 * 查询所有设备类别
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.queryDeviceTypeList = (event, context, callback) => {
  const dynamodb = require('./dynamodb');

  dynamodb.scan({TableName: 'device'}, (err, data) => {
    const response = {statusCode: null, body: null};
    if (err) {
      response.statusCode = 500;
      response.body       = JSON.stringify({code: 500, message: "ScanItem Error"});
    } else if ("Items" in data) {
      const types = new Set();
      data['Items'].forEach(device => types.add(device.type));
      response.statusCode = 200;
      response.body       = JSON.stringify({types: Array.from(types)});
    }
    callback(null, response);
  });
};

/**
 * 查询所有某一类型的设备
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.queryDeviceListByType = (event, context, callback) => {
  const dynamodb = require('./dynamodb');

  const type = event.queryStringParameters.type;

  dynamodb.scan({TableName: 'device'}, (err, data) => {
    const response = {statusCode: null, body: null};
    if (err) {
      response.statusCode = 500;
      response.body       = JSON.stringify({code: 500, message: "ScanItem Error"});
    } else if ("Items" in data) {
      const devices = [];
      data['Items'].forEach(device => {
        if (device.type === type) devices.push(device)
      });
      response.statusCode = 200;
      response.body       = JSON.stringify({devices: devices});
    }
    callback(null, response);
  });
};

/**
 * 删除设备
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.deleteDevice = (event, context, callback) => {
  const serialNumber = event.queryStringParameters.serialNumber;

  const dynamodb = require('./dynamodb');
  dynamodb.delete({TableName: 'device', Key: {serialNumber: serialNumber}}, (err, data) => {
    const response = {statusCode: null, body: null};
    if (err) {
      response.statusCode = 500;
      response.body       = JSON.stringify({code: 500, message: "DeleteItem Error"});
    } else {
      response.statusCode = 200;
      response.body       = JSON.stringify({code: 200, message: "Successfully delete device."});
    }
    callback(null, response);
  });
};

/**
 * 控制设备
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.controlDevice = (event, context, callback) => {
  const queryParams = event.queryStringParameters;
  const instruction = {
    targetDevice: queryParams.targetDevice,
    action      : queryParams.action
  };

  const actionList = ['turnOn', 'turnOff'];

  if (!(instruction.action in actionList)) {
    const response      = {statusCode: null, body: null};
    response.statusCode = 400;
    response.body       = JSON.stringify({code: 500, message: "Action not permitted."});
    callback(null, response);
  }

  const dynamodb = require('./dynamodb');
  const params   = {
    TableName                : 'device',
    Key                      : {serialNumber: instruction.targetDevice},
    UpdateExpression         : 'SET switcher = :s',
    ExpressionAttributeValues: {':s': instruction.action === 'turnOn' ? 'on' : 'off'},
    ReturnValues             : "UPDATED_NEW"
  };
  dynamodb.update(params, (err, data) => {
    const response = {statusCode: null, body: null};
    if (err) {
      response.statusCode = 500;
      response.body       = JSON.stringify({code: 500, message: "Fail to turn the device."});
    } else {
      response.statusCode = 200;
      response.body       = JSON.stringify({code: 200, message: "Device turned on."});
    }
    callback(null, response);
  })
};
