'use strict';

//create storage directory
var fs = require('fs');
var dir = 'storage'; //can't read from config until loopback is loaded, and can't load if this directory doesn't exists, that's why it's hardcoded

if (!fs.existsSync(dir)){
  var shell = require('shelljs');
  shell.mkdir('-p', dir);
}

var loopback = require('loopback');
var boot = require('loopback-boot');

var authMiddleware = require('./middleware/auth.middleware');

var app = module.exports = loopback();

app.middleware("auth:after", authMiddleware());

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
