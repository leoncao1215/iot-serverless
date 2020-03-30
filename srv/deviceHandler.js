'use strict';

const util = require('./util');

// 添加单个设备
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
    console.log(JSON.stringify(params));
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

// 查询设备列表
module.exports.queryDeviceList = (event, context, callback) => {
  const dynamodb = require('./dynamodb');

  dynamodb.scan({TableName: 'device'}, (err, res) => {
    const response = {statusCode: null, body: null};
    if (err) {
      console.log(err);
      response.statusCode = 500;
      response.body       = JSON.stringify({code: 500, message: "ScanItem Error"});
    } else if ("Items" in res) {
      response.statusCode = 200;
      response.body       = JSON.stringify({devices: res["Items"]});
    }
    callback(null, response);
  });
};
