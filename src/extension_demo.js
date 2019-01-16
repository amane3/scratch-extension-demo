(function(ext){
var device = null;
var rawData = null;
var connected = false;
var poller = null;
var parsingMsg = false;
var msgBytesRead = 0;
    
var ANALOG_WRITE = 2;
var DIGITAL_WRITE = 3;
    
var START_MSG = 0,
    END_MSG = 0;
    
var pingCmd = new Uint8Array(1);
pingCmd[0] = 1;
    
var sendAttempts = 0;
    
function processInput(data) {
      if (data == START_MSG) {
          parsingMsg = false;
          msgBytesRead = data;
        }
      console.log(data);
}

    


ext.log_test = function(str) {
// do something
};

ext.turnOn = function(str) {
    // turnOn LED
    var buf = new Uint8Array(2);
    buf[0] = 2;
    buf[1] = 1;
    device.send(buf.buffer);
};

ext.turnOff = function(str) {
    // turnOff LED
    var buf = new Uint8Array(2);
    buf[0] = 2;
    buf[1] = 0;
    device.send(buf.buffer);
};

ext.blink = function(str) {
    // blink LED
    var buf = new Uint8Array(2);
    buf[0] = 2;
    buf[1] = 2;
    device.send(buf.buffer);
};


ext.setLED = function(str) {
// do something
};

ext._getStatus = function() {
    if(!device) return {status: 1, msg: 'Device not connected'};
    return {status: 2, msg: 'Device connected'};
};

ext._deviceRemoved = function(dev) {
    // Not currently implemented with serial devices
};


 var poller = null;
  ext._deviceConnected = function(dev) {
    sendAttempts = 0;
    connected = true;
    if (device) return;
    
    device = dev;
    device = potentialDevices.shift();
    device.open({ stopBits: 0, bitRate: 9600, ctsFlowControl: 0 });
    device.set_receive_handler(function(data) {
      sendAttempts = 0;
      console.log(data);
      var inputData = new Uint8Array(data);
      processInput(inputData);
        
    }); 

  };
ext._shutdown = function() {
   if (device) device.close();
   if (poller) clearInterval(poller);
   device = null;
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
