import * as http from "http";  
import * as express from "express";  
import * as bodyParser from "body-parser";  
import * as swaggerUI from "swagger-ui-express";  
import * as Debug from 'debug';

let debug = Debug('<%= name %>:http');

import { RegisterRoutes } from "./routes/routes";  

import './index';

// Define the app
const port = process.env.PORT ? process.env.PORT : 3000;
const app: express.Application = express();  

// General use includes
app.use(bodyParser.urlencoded({ extended: true }));  
app.use(bodyParser.json());  

// Register tsoa routes
RegisterRoutes(app);

// Serve up Swagger UI
const swaggerJSON = require('./swagger/swagger.json');  
app.use('/swagger.json', express.static(__dirname + '/swagger/swagger.json'));
app.get('/', swaggerUI.serve, swaggerUI.setup(swaggerJSON)); 

// Handle 404's
app.use('*', (req, res, next) => {
    res.sendStatus(404);
})

// Start the server
const server = http.createServer(app);  
server.listen(port);

// Handle server events
server.on('error', err => {throw err});
server.on('listening', _ => {
    debug('Listening on port ' + server.address().port);
});

export default app;  