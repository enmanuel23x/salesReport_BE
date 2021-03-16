require('dotenv').config();
require('rootpath')();
//NPM requires
const express = require('express')
const cors = require('cors')
const http = require('http')
//Project's require
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const userRouter = require('./src/routes/userRouter')
const reportsRouter = require('./src/routes/reportsRouter')
const hblRouter = require('./src/routes/hblRouter')
//Initialization
const version = '/api/v1';
const PORT = process.env.PORT || 2001
const app = express()

app.use(express.json())
app.use(express.Router())
app.use(cors())
// use JWT auth to secure the api
app.use(jwt());
//Routes
app.use(version, userRouter)
app.use(version, reportsRouter)
app.use(version, hblRouter)
// global error handler
app.use(errorHandler);

//Server
app.set('port', PORT);
const server = http.createServer(app)
server.listen(PORT, () => console.log(`Backend solicitud salesReport corriendo en localhost:${PORT}`));