const express = require('express');

const secure = require('./secure');
const response = require('../../../network/response');
const Controller = require('./index');


/---------------------------------------------------------/
const router = express.Router();
router.get('/', list)
router.get('/:id', get);
router.get('/following/:id', getfollow);
router.post('/follow/:id', secure('follow'), follow);
router.post('/', upsert);
router.put('/', secure('update'), upsert);
/---------------------------------------------------------/



function list(req, res, next) {
    Controller.list()
    .then((lista) => { response.success(req, res, lista, 200); })
    .catch(next);
}

function get(req, res,next) {
    Controller.get(req.params.id)
    .then((user) => { response.success(req, res, user, 200); })
    .catch(next);
}

function upsert(req, res,next) {
    Controller.upsert(req.body)
    .then((user) => { response.success(req, res, user, 201); })
    .catch(next); 
}

function follow(req,res, next){
    Controller.follow(req.user.id, req.params.id)
    .then((data) => { response.success(req, res, data, 201); })
    .catch(next);
}

function getfollow(req,res, next){
    
    return Controller.getFollowers(req.params.id)
    .then((data) => { response.success(req, res, data, 200); })
    .catch(next);
}


module.exports = router;