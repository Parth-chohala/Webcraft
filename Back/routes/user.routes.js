const Router = require('express').Router();
const userController = require('../controllers/userController');
const userAuth = require('../middlewares/user.auth');

Router.post("/finduser",userAuth,userController.findforuser);
Router.post('/register', userController.register);
Router.post('/login', userController.login);
Router.get('/getUser', userAuth, userController.getUser);
Router.put('/updateUser',userAuth, userController.updateUser);
Router.delete('/deleteUser',userAuth, userController.deleteUser);
Router.get('/logout', userAuth, userController.logout);

module.exports = Router;