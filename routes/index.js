var express = require('express');
var router = express.Router();
const UserController = require('./Controller/UserController');


/* GET home page. */
router.get('/RegisterPage', function(req, res, next) {
  res.render('cadastrar/cadastrar', { title: 'Register' });
});

router.get('/register', async (req, resp) => {
  try{
    resp.send(await UserController.SaveUser(req.knex, req.query, req.query.filter));
  } catch (err){
    if (Array.isArray(err)){
      resp.sendStatus(500).send(err);
      return;
    }    
    resp.sendStatus(500);
  }
});

router.get('/list', async (req, resp, next) => {
  try{
    resp.send(await UserController.list(req.knex, req.query.filter));
  } catch (err){
    if (Array.isArray(err)){
      resp.sendStatus(400).send(err);
      return;
    }    
    resp.sendStatus(500);
  }
});

router.get('/remove', async (req, resp, next) => {
  try{
    resp.send(await UserController.deleteUser(req.knex, req.query));
  } catch (err){
    if (Array.isArray(err)){
      resp.sendStatus(400).send(err);
      return;
    }    
    resp.sendStatus(500);
  }
});

router.post('/mock_users', async (req, resp) => {
  try{
    for (let i = 0; i < 20; i++) {
      await UserController.SaveUser(req.knex, { 
        isNew:true,  
        Name:`user${i}`, 
        BirthDate: '1993-09-08T20:56:26.557Z', 
        Email: `user${i}@otmail.com`, 
        SexId: ( i%2 != 0 ) ? 1 : 2, 
        Password: '123456', 
        Active: 1
      });  
    }
    const list = await UserController.list(req.knex);
  
    resp.send(list);
  } catch (err){
    if (Array.isArray(err))
      resp.send({ status: 500, err });
  }
})

module.exports = router;
