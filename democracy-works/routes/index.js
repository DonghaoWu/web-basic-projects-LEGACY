var express = require('express');
var router = express.Router();
var us_states = require('../us_state.js');
const { upcoming } = require('../public/controllers/query')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Find My Election', states: us_states });
});

/* GET upcoming elections info. */
router.post('/search', upcoming);

module.exports = router;
