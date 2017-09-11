var express = require('express');
var router = express.Router();

router.use('/:userName?/', function(req, res, next) {
  console.log(req.session.user);
    res.render('user', { user: req.session.user } );
});

module.exports = router;
