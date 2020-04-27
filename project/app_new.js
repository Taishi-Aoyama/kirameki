var bleno = require('bleno');
var util = require('util');
var {PythonShell} = require('python-shell');
var TEST = new PythonShell('servo.py');

var Characteristic = bleno.Characteristic;
var PrimaryService = bleno.PrimaryService;

var serviceUuid = 'e9bac28261bf4432b94d316b31cca64e';
var data = new Buffer(1);
var num;

/*stateChangeイベントの登録。接続状態が変化するとコールバック関数が呼び出される*/
bleno.on('stateChange',function(state){
    console.log('on ->stateChange:'+state);
    if(state === 'poweredOn'){
        //指定された名前とUUIDでアドバタイズを開始
        bleno.startAdvertising('ble',[serviceUuid]);
    }else {
        bleno.stopAdvertising();
    }
});

/*advertisingStartイベントの登録。アドバタイズが始まるとコールバック関数が呼び出される*/
bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
  if (!error) {
    bleno.setServices([primaryService], function(error){
      console.log('setServices: '  + (error ? 'error ' + error : 'success'));
      console.log(primaryService.uuid);
      console.log(serviceUuid);
    });
  }
});


var SwitchCharacteristic = function() {
  SwitchCharacteristic.super_.call(this, {
    uuid: 'ff11',
    properties: ['read', 'write', 'notify']
  });
};

util.inherits(SwitchCharacteristic, Characteristic);

SwitchCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('read request');
  //var data = 1;
  //data = new Buffer(1);
  callback(this.RESULT_SUCCESS, data);
};

SwitchCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('write request: ' + data.toString('hex'));
  if (data.toString("hex") === "1000") {
    TEST = new PythonShell('servo.py');
    TEST.send("1000");
    TEST.on('message', function(data) {
      console.log(data);
    });
    //test1();
  }
  else {
    console.log('end');
    TEST.terminate(); // end command
    TEST.on('message', function(data) {
      console.log(data);
    });
  }
  callback(this.RESULT_SUCCESS);
};

var primaryService = new PrimaryService({
  uuid: serviceUuid,
  characteristics: [new SwitchCharacteristic()]
});

/*
function test1() {
  PythonShell.run('servo.py', null, function (err, result) {
    if (err) throw err;
    //console.log(result);
  });
  //TEST.on('message', function(data) {
  //  console.log(data);
  //});
}
*/

function exit() {
  process.exit();
}

process.on('SIGINT', exit); //ctr + c