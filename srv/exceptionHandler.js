'use strict';

const util = require('./util');

/**
 * 添加异常
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.addException = (event, context, callback) => {
  const dynamodb = require('./dynamodb');

  const data = JSON.parse(event.body);

  const response = {statusCode: null, body: null};
  const params   = {
    TableName: 'exception',
    Item     : {
      exceptionId:data.exceptionId||Math.random(10000000).toString(),
      serialNumber  : data.serialNumber,
      exceptionContent: data.exceptionContent,
      exceptionCode : data.exceptionCode,
      time : data.time,
      isresolved : data.isresolved||false
    }
  };

  dynamodb.put(params, (err, res) => {
    if (err) {
      response.statusCode = 500;
      response.body       = JSON.stringify({
        code   : 500,
        message: "Unable to add exception. Error JSON:" + JSON.stringify(err, null, 2)
      });
    } else {
      response.statusCode = 200;
      response.body       = JSON.stringify({
        code   : 200,
        message: "Successfully add exception:" + JSON.stringify(res, null, 2)
      });
    }
    callback(null, response);
  })
};

/**
 * 查询所有异常
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.queryExceptionList = (event, context, callback) => {
  const dynamodb = require('./dynamodb');

  dynamodb.scan({TableName: 'exception'}, (err, res) => {
    const response = {statusCode: null, body: null};
    if (err) {
      response.statusCode = 500;
      response.body       = JSON.stringify({code: 500, message: "ScanItem Error"});
    } else if ("Items" in res) {
      response.statusCode = 200;
      response.body       = JSON.stringify({exception: res["Items"]});
    }
    callback(null, response);
  });
};

/**
 * 更新异常
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.updateException = (event, context, callback) => {
  const dynamodb = require('./dynamodb');

  const data = JSON.parse(event.body);

  const response = {statusCode: null, body: null};
  const params   = {
    TableName: 'exception',
    Item     : {
      exceptionId:data.exceptionId||Math.random(10000000).toString(),
      serialNumber  : data.serialNumber,
      exceptionContent: data.exceptionContent,
      exceptionCode : data.exceptionCode,
      time : data.time,
      isresolved : data.isresolved||false
    }
  };

  dynamodb.put(params, (err, res) => {
    if (err) {
      response.statusCode = 500;
      response.body       = JSON.stringify({
        code   : 500,
        message: "Unable to add exception. Error JSON:" + JSON.stringify(err, null, 2)
      });
    } else {
      response.statusCode = 200;
      response.body       = JSON.stringify({
        code   : 200,
        message: "Successfully add exception:" + JSON.stringify(res, null, 2)
      });
    }
    callback(null, response);
  })
};

/**
 * 查询某一个设备的所有异常
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.queryDeviceExceptionList = (event, context, callback) => {
  const dynamodb = require('./dynamodb');

  const serialNumber = event.queryStringParameters.serialNumber;

  dynamodb.scan({TableName: 'exception'}, (err, res) => {
    const response = {statusCode: null, body: null};
    if (err) {
      response.statusCode = 500;
      response.body       = JSON.stringify({code: 500, message: "ScanItem Error"});
    } else if ("Items" in res) {
      const exceptions = [];
      res['Items'].forEach(exception => {
        if (exception.serialNumber === serialNumber) exceptions.push(exception)
      });
      response.statusCode = 200;
      response.body       = JSON.stringify({exceptions: exceptions});
    }
    callback(null, response);
  });
};

/**
 * 删除异常
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.deleteException = (event, context, callback) => {
  const exceptionId = event.queryStringParameters.exceptionId;

  const dynamodb = require('./dynamodb');
  dynamodb.delete({TableName: 'exception', Key: {exceptionId: exceptionId}}, (err, res) => {
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
