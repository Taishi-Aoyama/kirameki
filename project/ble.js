var bleno = require('bleno');
var {PythonShell} = require('python-shell');

var name = 'kirameki-device';
var serviceuuids = ['180F'];

var primaryService = new bleno.PrimaryService({
  uuid: '180F',
  characteristic: [
    new bleno.Characteristic({
      uuid: '2A19',
      properties: ['read'],
      value: new Buffer([100])
    })
  ]
});

bleno.on('stateChange', function(state) {
  console.log('stateChange: '+ state);
  if(state === 'poweredOn') {
    bleno.startAdvertising(name, serviceuuids, function(error){
      if(error) console.error(error);
    });
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  if(!error) {
    console.log('start advertising...');
    bleno.setServices([primaryService]);
  } else {
    console.error(error);
  }
});