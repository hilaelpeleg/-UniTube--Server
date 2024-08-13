import user from '../models/user.js';
import userModel from '../models/user.js'

function getAllUsers(req, res){
    const users = userModel.getUsers()
    res.render('../views/user', user)
}

function getUser(req, res){
    const user = userModel.getUser(req.query.userName)
}

function createUser(req, res){
    const users = userModel.createUser(req.body.userName, req.body.firstName, req.body.lastName, req.body.password,
        req.body.reEnterPassword);
}