const Router = require('express').Router();
const userController = require('../controllers/userController');
const TransferRequestController = require('../controllers/transferController')
const userAuth = require('../middlewares/user.auth');
const { default: transferController } = require('../controllers/transferController');

Router.post("/AcceptOrRejectTransfer/:flag",transferController.AcceptOrRejectTransfer);

Router.get("/verify/:token",transferController.validatetransfer);
Router.post("/initiateTransfer/:id",userAuth,transferController.initiateTransfer)

module.exports = Router;