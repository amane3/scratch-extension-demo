(function(ext){

ext._shutdown = function() {};
ext._getStatus = function() {
    return {status: 2,msg: "Ready"};
};

ext.log_test = function(str) {
// do something
};

ext.turnOn = function(str) {
// do something
};


ext.setLED = function(str) {
// do something
};

var blocks = [
     [' ','log','log_test'],
     [' ','set light x:%d.rowcol y:%d.rowcol %m.ledState','setLED',1,1,'on'],
     ['h','when %m.btns button pressed','ButtonPressed','A'],
     [' ','turn on something','turnOn'],

  ];

var menus = {
   btns:['A','B'],
   rowcol:[1,2,3,4,5,"ramdom"],
};

var descriptor = {
   blocks:blocks,
   menus:menus,
};




ScratchExtensions.register('Log Extension', descriptor, ext);
})({});
