const express = require('express');
const usersRouter = express.Router();
const usersController = require('../controllers/userControllers');

const uriUsers = '/users';
const uriUsersId = '/users/:id';
const uriUsersEmail = '/usersEmail/:email';
const uriUsersSellerByEmail = '/usersSellerByEmail/:email';
const uriUsersByIdSupervisor = '/usersIdSupervisor/:idsupervisor'
usersRouter.route(uriUsers)
    .get(usersController.getAllUser)
    .post(usersController.addUsers);


usersRouter.route(uriUsersId)
    .get(usersController.getUsersById)
    .put(usersController.updateUsers)
    .delete(usersController.deleteUsers);
usersRouter.route(uriUsersEmail)
    .get(usersController.getUsersByEmail)

usersRouter.route(uriUsersSellerByEmail)
    .get(usersController.getUserSellerByEmail)    

usersRouter.route(uriUsersByIdSupervisor)
    .get(usersController.getUsersByIdSupervisor)    
    

module.exports = usersRouter;