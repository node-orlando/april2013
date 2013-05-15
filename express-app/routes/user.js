
/*
 * GET users listing.
 */

exports.list = function(req, res){
  // we have a req.username now because of the param
  res.render('users', { title: 'Users | Express App', username: req.username });
};