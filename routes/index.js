var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/Register', function(req, res, next) {
  res.render('cadastrar', { title: 'Register' });
});

router.post('/register', async () => {
  
});

module.exports = router;
