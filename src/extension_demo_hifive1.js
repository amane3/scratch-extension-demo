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

function numRange(num){
      if(num<0){
          return 0;
      }else if(num>255){
          return 255;
      }else{
          return 255-num;
      }
}   


ext.log_test = function(str) {
    // log alert
    alert(device);
};

ext.turnOn = function(r,g,b) {
    // turnOn LED
    var buf = new Uint8Array(5);
    buf[0] = 2;
    buf[1] = 1;
    buf[2] = Math.floor(numRange(r)/100);
    buf[3] = Math.floor((numRange(r)%100)/10);
    buf[4] = (numRange(r)%100)%10;
    buf[5] = Math.floor(numRange(g)/100);
    buf[6] = Math.floor((numRange(g)%100)/10);
    buf[7] = (numRange(g)%100)%10;
    buf[8] = Math.floor(numRange(b)/100);
    buf[9] = Math.floor((numRange(b)%100)/10);
    buf[10] = (numRange(b)%100)%10;
    console.log(r);
    console.log(g);
    console.log(b);
    console.log(buf[2]);
    console.log(buf[3]);
    console.log(buf[4]);
    device.send(buf.buffer);
};

ext.turnOff = function(str) {
    // turnOff LED
    var buf = new Uint8Array(2);
    buf[0] = 2;
    buf[1] = 0;
    device.send(buf.buffer);
};

ext.blink = function(color) {
    // blink LED
    var buf = new Uint8Array(3);
    buf[0] = 2;
    buf[1] = 2;
    if(color == 'RED'){
      buf[2] = 0;
    }else if(color == 'GREEN'){
      buf[2] = 1;
    }else{
      buf[2] = 2;
    }
    device.send(buf.buffer);
};

ext.ChangingColor = function(str){
    // Changing LED colors
    var buf = new Uint8Array(2);
    buf[0] = 2;
    buf[1] = 3;
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
    device.open({ stopBits: 0, bitRate: 9600, ctsFlowControl: 0 });
    device.set_receive_handler(function(data) {
      sendAttempts = 0;
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
     [' ','Connected Device','log_test'],
     [' ','set light x:%d.rowcol y:%d.rowcol %m.ledState','setLED',1,1,'on'], 
     [' ','R %n G %n B %n turn on LED','turnOn',0,0,0],
     [' ','turn off LED','turnOff'],
     [' ','Blink LED%m.colors','blink','RED'],
     [' ','Changing LED colors','ChangingColor'],
  ];

var menus = {
   btns:['A','B'],
   rowcol:[1,2,3,4,5,"ramdom"],
   colors:['RED','GREEN','BLUE'],
};

var descriptor = {
   blocks:blocks,
   menus:menus,
};

var serial_info = {type: 'serial'};
ScratchExtensions.register('Hifive1', descriptor, ext, serial_info);

})({});
