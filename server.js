require('dotenv').config();
//NPM requires
const express = require('express')
const cors = require('cors')
const http = require('http')
//Project's require
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
//Routes
app.use(version, userRouter)
app.use(version, reportsRouter)
app.use(version, hblRouter)


//Server
app.set('port', PORT);
const server = http.createServer(app)
server.listen(PORT, () => console.log(`Backend solicitud S-TA-24 corriendo en localhost:${PORT}`));