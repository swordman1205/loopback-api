//TODO get authToken and Worker through context

module.exports = function() {
  return function authMiddleware(req, res, next) {
    var app = require('../server');
    var AccessToken = app.models.AccessToken;
    var Log = app.models.Log;
    var Worker = app.models.Worker;

    var authToken = req.headers.authorization

    var log = {
      "username": "N/A",
      "remote_ip": req.ip,
      "method": req.method,
      "url": req.originalUrl,
      "date": new Date(),
      "status_code": 0
    }
    
    if (authToken) {
      AccessToken.findById(authToken, function(err, accessToken) {

        if (err) {
          console.log(err)
        } else if (accessToken && !(res.Worker)) {
          Worker.findById(accessToken.userId, function(err, worker) {
            res.append("Worker", worker);
            log.username = worker.username;
          })
        } else { //probably unauthorized
        }
      })
    }

    res.once('finish', function() {
      log.status_code = res.statusCode;
      Log.create(log);
    });

    next();
  }
}
