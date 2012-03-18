(function() {
  /*
      Ok, Here We go.
  */
  var app, express, request;
  express = require("express");
  request = require("request");
  app = express.createServer();
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/statics'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.get('/api/list*', function(req, res) {
    var url;
    url = 'http://faxianla.com/mark/popular.jsn?offset=0&_=1332062171115';
    return request.get(url, function($err, $res, $body) {
      var data, i, info, json, key, _i, _len, _ref;
      data = JSON.parse($body);
      json = [];
      _ref = data.data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        info = {
          intro: i.title,
          src: i.image_url
        };
        key = new Buffer(JSON.stringify(info), 'utf-8').toString('base64');
        json.push({
          id: key.replace(/\//gi, '|#|'),
          intro: i.title,
          src: i.image_url
        });
      }
      return res.send(json);
    });
  });
  app.get('/api/view/:key', function(req, res) {
    var info, key;
    key = req.params.key.replace(/\|\#\|/gi, '/');
    key = new Buffer(key, 'base64').toString('utf-8');
    info = JSON.parse(key);
    info.src = info.src.replace('metal', 'wood');
    return res.send(info);
  });
  app.get('/*', function(req, res) {
    return res.render('index', {
      layout: false
    });
  });
  app.listen('8888');
}).call(this);
