var shell = require('shelljs');
var timer, delay = 10 * 1000;

var captureJpeg = function () {
    var now = new Date();
    var filedate = now.toISOString().replace(/:/g,'');
    var pathPrefix = './stills/';
    var extension = '.jpg';
    var imgWidth = 1296;
    var imgHeight = 972;
    var quality = 60;
    var preDelay = 500;

    // setup capture with time before shot and no preview
    var code = 'raspistill -t ' + preDelay + ' -n ';
    // auto white balance
    code += '-awb auto ';
    // dimensions
    code += '-w ' + imgWidth + ' -h ' + imgHeight + ' ';
    // quality
    code += '-q ' + quality + ' ';
    // flip vertical + horizontal (upside-down camera)
    // code += '-vf -hf ';
    // path to file
    code += '-o ' + pathPrefix + filedate + extension;

    console.log(now);
    console.log(code);

    shell.exec(code);

    console.log(pathPrefix + filedate + extension);
    
    resetTimer();
};

var resetTimer = function () {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
    timer = setTimeout(captureJpeg, delay);
};

resetTimer();