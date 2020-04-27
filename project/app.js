var bleno = require('bleno');
var Characteristic = require('./Characteristic');
var serviceUuid = 'e9bac282-61bf-4432-b94d-316b31cca64e';

/*stateChangeイベントの登録。接続状態が変化するとコールバック関数が呼び出される*/
bleno.on('stateChange',function(state){
    console.log('on ->stateChange:'+state);
    if(state === 'poweredOn'){
        //指定された名前とUUIDでアドバタイズを開始
        bleno.startAdvertising('led',[serviceUuid]);
    }else {
        bleno.stopAdvertising();
    }
});
/*advertisingStartイベントの登録。アドバタイズが始まるとコールバック関数が呼び出される*/
bleno.on('advertisingStart',function(error){
    if(!error){
        bleno.setServices([
                new bleno.PrimaryService({
                    uuid : serviceUuid,
                    characteristics : [new Characteristic()]
                })
            ]
        );
        console.log('on ->advertisingStart');
    }
});