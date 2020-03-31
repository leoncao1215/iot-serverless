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

  const data = JSON.parse(event.body);

  const response = {statusCode: null, body: null};
  const params   = {
    TableName: 'device',
    Item     : {
      clientId    : data.clientId,
      serialNumber: data.serialNumber,
      deviceName  : data.deviceName,
      type        : data.type,
      disabled    : data.disabled || false,
      down        : data.down || false
    }
  };

  dynamodb.put(params, (err, res) => {
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
        message: "Successfully add device:" + JSON.stringify(res, null, 2)
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
  let cnt = devices.length;

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

    dynamodb.put(params, (err, res) => {
      if (err) {
        errorList.push(params['Item']);
      }
      --cnt;
      if (cnt <= 0) {
        if (errorList.length !== 0) {
          response.statusCode = 500;
          response.body       = JSON.stringify({code: 500, message: "Fail to add devices: " + JSON.stringify(errorList)});
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

  dynamodb.scan({TableName: 'device'}, (err, res) => {
    const response = {statusCode: null, body: null};
    if (err) {
      response.statusCode = 500;
      response.body       = JSON.stringify({code: 500, message: "ScanItem Error"});
    } else if ("Items" in res) {
      response.statusCode = 200;
      response.body       = JSON.stringify({devices: res["Items"]});
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

  dynamodb.scan({TableName: 'device'}, (err, res) => {
    const response = {statusCode: null, body: null};
    if (err) {
      response.statusCode = 500;
      response.body       = JSON.stringify({code: 500, message: "ScanItem Error"});
    } else if ("Items" in res) {
      const types = new Set();
      res['Items'].forEach(device => types.add(device.type));
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

  dynamodb.scan({TableName: 'device'}, (err, res) => {
    const response = {statusCode: null, body: null};
    if (err) {
      response.statusCode = 500;
      response.body       = JSON.stringify({code: 500, message: "ScanItem Error"});
    } else if ("Items" in res) {
      const devices = [];
      res['Items'].forEach(device => {
        if (device.type === type) devices.push(device)
      });
      response.statusCode = 200;
      response.body       = JSON.stringify({devices: devices});
    }
    callback(null, response);
  });
};
