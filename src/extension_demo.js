(function(ext){
var device = null;
var rawData = null;
var connected = false;
var poller = null;
var parsingMsg = false;
var msgBytesRead = 0;
    
var ANALOG_WRITE = 1;
var DIGITAL_WRITE = 2;
    
var START_MSG = 0xF0,
    END_MSG = 0xF7;
    
var pingCmd = new Uint8Array(1);
pingCmd[0] = 1;
    
var sendAttempts = 0;
    
function processInput(data) {
      if (data[0] == START_MSG) {
          parsingMsg = false;
          msgBytesRead = data[0];
        }
}

    

//sending buffer to board
function analogWrite(msg){
    console.log(msg);
    var buf = new Uint8Array(2);
    buf[0] = ANALOG_WRITE;
    buf[1] = msg;
    //console.log(buf[0]);
    //console.log(buf[1]);
    //device.send(buf.buffer);
    //var buf = Buffer.from(msg,'base64');
    console.log(device);
    device.send(buf.buffer);
}

ext.log_test = function(str) {
// do something
};

ext.turnOn = function(str) {
    // turnOn LED
    var s = 0;
    return analogWrite(s);
};

ext.turnOff = function(str) {
    // turnOff LED
    var s = 1;
    return analogWrite(s);
};

ext.blink = function(str) {
    // blink LED
    var s = 2;
    return analogWrite(s);
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
    device.open({ stopBits: 0, bitRate: 9600, ctsFlowControl: 0 });
    device.set_receive_handler(function(data) {
      sendAttempts = 0;
      var inputData = new Uint8Array(data);
      processInput(inputData);
    }); 

    poller = setInterval(function() {

      /* TEMPORARY WORKAROUND
         Since _deviceRemoved is not
         called while using serial devices */
      if (sendAttempts >= 10) {
        connected = false;
        device.close();
        device = null;
        rawData = null;
        clearInterval(poller);
        return;
      }
      
      device.send(pingCmd.buffer); 
      sendAttempts++;

    }, 50);

ext._shutdown = function() {
   if (device) device.close();
   if (poller) clearInterval(poller);
   device = null;
  };
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
