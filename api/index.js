const express = require('express')
const bodyParser= require('body-parser');

const swaggerUi= require('swagger-ui-express');//documentacion de la api

const config = require('../config.js')
const user = require('./components/user/network')
const auth = require('./components/auth/network');
const errors = require('../network/error')

const app= express();

app.use(bodyParser.json())
const swaggerDoc= require('./swagger.json');

//ROUTER
app.use('/api/user', user);
app.use('/api/auth', auth.router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(errors);

app.listen(config.api.port, ()=>{
    console.log('Escuchando en el puerto', config.api.port)
})
