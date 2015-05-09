var shell = require('shelljs');
var client = require('scp2');
var timer, delay = 60 * 1000;

var user = process.argv[2];
var password = process.argv[3];
if (!user || !password) {
    console.log('You must provide a username and password for this to work.');
    return;
}

/*

things to pass through arguments:

- path: './stills'
- width: 1296
- height: 972
- quality: 60
- flipV: false // -vf
- flipH: false // -hf
- awb: auto // auto white balance

 */

var captureJpeg = function () {
    var now = new Date();
    var filedate = now.toISOString().replace(/:/g,'');
    var file;
    var serverPath = '/home/chadzilla/files.chadzilla.com/picamera/';
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
    file = pathPrefix + filedate + extension;
    code += '-o ' + file;

    // console.log(now);
    // console.log(code);

    shell.exec(code);
    // console.log('shell.exec(code);');
    // console.log(pathPrefix + filedate + extension);

    // resetTimer();
    // console.log('resetTimer();')

    client.scp(file, {
        host: 'chadzilla.com',
        username: user,
        password: password,
        path: serverPath
    }, function (err) {
        console.log('done with scp', err);
        console.log('file:', 'http://files.chadzilla.com/picamera/' + file);
    });
};

var resetTimer = function () {
    // console.log('resetting timer...');
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
    timer = setTimeout(captureJpeg, delay);
};

// console.log('go!');
captureJpeg();