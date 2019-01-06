(function(ext){
var device = null;
var rawData = null;


ext._shutdown = function() {};
ext._getStatus = function() {
   if(!device) return {status: 1, msg: 'Device not connected'};
   return {status: 2, msg: 'Device connected'};
}

var potentialDevices = [];
    ext._deviceConnected = function(dev) {
        potentialDevices.push(dev);

        if (!device) {
            tryNextDevice();
        }
    }

    var poller = null;
    var watchdog = null;
    function tryNextDevice() {
        // If potentialDevices is empty, device will be undefined.
        // That will get us back here next time a device is connected.
        device = potentialDevices.shift();
        if (!device) return;

        device.open({ stopBits: 0, bitRate: 9600, ctsFlowControl: 0 });
        device.set_receive_handler(function(data) {
            //console.log('Received: ' + data.byteLength);
            if(!rawData || rawData.byteLength == 18) rawData = new Uint8Array(data);
            else rawData = appendBuffer(rawData, data);

            if(rawData.byteLength >= 18) {
                //console.log(rawData);
                processData();
                //device.send(pingCmd.buffer);
            }
        });

        var pingCmd = new Uint8Array(1);
        pingCmd[0] = 1;
        poller = setInterval(function() {
            device.send(pingCmd.buffer);
        }, 50);
        watchdog = setTimeout(function() {
            // This device didn't get good data in time, so give up on it. Clean up and then move on.
            // If we get good data then we'll terminate this watchdog.
            clearInterval(poller);
            poller = null;
            device.set_receive_handler(null);
            device.close();
            device = null;
            tryNextDevice();
        }, 250);
    };

function analogWrite(msg){
    var buf = new Uint8Array([msg]);
    console.log(msg);
    device.send(buf.buffer);
}

ext.log_test = function(str) {
// do something
};

ext.turnOn = function(str) {
    // turnOn LED
    var s = "o";
    return analogWrite(s);
};

ext.turnOff = function(str) {
    // turnOff LED
    var s = "f";
    return analogWrite(s);
};

ext.blink = function(str) {
    // blink LED
    var s = 'b';

    return analogWrite(s);
};


ext.setLED = function(str) {
// do something
};

var blocks = [
     ['h','when %m.btns button pressed','ButtonPressed','A'],
     [' ','log','log_test'],
     [' ','set light x:%d.rowcol y:%d.rowcol %m.ledState','setLED',1,1,'on'], 
     [' ','turn on LED','turnOn'],
     [' ','turn off LED','turnOff'],
     [' ','Blink LED','blink'],

  ];

var menus = {
   btns:['A','B'],
   rowcol:[1,2,3,4,5,"ramdom"],
};

var descriptor = {
   blocks:blocks,
   menus:menus,
};

var serial_info = {type: 'serial'};
ScratchExtensions.register('Hifive1', descriptor, ext, serial_info);

})({});
