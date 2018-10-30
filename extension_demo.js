(function(ext){

ext._shutdown = function() {};
ext._getStatus = function() {
    return {status: 2,msg: "Ready"};
};

ext.log_test = function(str) {
    alert(str);
};


var descriptor = {
   blocks:[
     [' ','log','log_test'],
  ]
};


ScratchExtensions.register('Log Extension', descriptor, ext);
})({});
