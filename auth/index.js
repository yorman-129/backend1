const jwt = require('jsonwebtoken');
const config = require('../config')
const error = require('../utils/error')
const secret= config.jwt.secret;

function sign(data){
return jwt.sign(data, secret);
}

function verify(token) {
    return jwt.verify(token, secret)
}
//variable de objetos que almacena funciones
const check={
    own: function(req,owner){
        const decoded = decodeHeader(req);
        if(decoded.id!==owner){
            throw error('no tienes privilegios para esta operacion', 401);
        }
    },
    logged: function(req,owner){
        const decoded = decodeHeader(req);
    }
}


function getToken(auth) {
    if(!auth){
        throw error('no tiene token', 401);
    }
    if (auth.indexOf('bearer ')!==-1) {
        throw error('formato invalido', 401);
    }
    let token = auth.replace('Bearer ','');

    return token;
}


function decodeHeader(req) {
    const authorization=req.headers.authorization || '';
    const token = getToken(authorization);
    const decoded = verify(token);

    req.user= decoded;

    return decoded;
}

module.exports = {
   check,sign
};