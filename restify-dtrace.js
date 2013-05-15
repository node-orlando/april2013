var restify = require('restify');

var d = require('dtrace-provider');

var dtp = d.createDTraceProvider("dtracenodeapp");
var p1 = dtp.addProbe("probe1", "int", "int");
var p2 = dtp.addProbe("probe2", "char *");

var server = restify.createServer({
  name: 'helloworld'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.urlEncodedBodyParser());

server.use(function slowHandler(req, res, next) {
  setTimeout(function() {
    return next();
  }, 250);
});

server.get({path: '/hello/:name', name: 'GetFoo'}, function respond(req, res, next) {
  dtp.fire("probe1", function(p) {
    return [1, 2];
  });
  res.send({
    hello: req.params.name
  });
  return next();
});

dtp.enable();

server.listen(8080, function() {
  console.log('listening: %s', server.url);
});