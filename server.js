//Create http
const http = require('http');

//set default value for environment
let environment = 'default';

// set the environment you want to load the configuration from config.json file
// if no environment set, use the 'default' configuration
if (!process.argv[2]) {
  console.log(`Using "${environment}" environment values to start http server!`);
  console.log('\nuse: "node <scriptname.js> [environment]" if you want to load specific environment configuration');
  console.log('\nsample: \n"node <scriptname.js> development" \n--> will load development configuration from ./config/config.json');
} else {
  environment = process.argv[2];
  console.log(`Using "${environment}" environment values to start http server!`);
}
// load the configuration calling the loadConfig module and passing the environment you 
// want the configuration as a parameter
const loadConfig = require('./config/loadConfig')(environment);

//if we got a false from error_code, means that configuration was loaded successful,  
//so we can continue and start the http server
if ( !loadConfig.error_code ) { 

  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(loadConfig));
    res.end();  
  });

  //if we found configuration but there is no port or host defined we will use a default value
  //this way http server will be able to start
  if (!loadConfig.node_port){
    console.log('No port defined on configuration file, set default: 3000');
    loadConfig.node_port = 3000;
  }
  if (!loadConfig.host) {
    console.log('No host defined on configuration file, set default: localhost');
    loadConfig.host = 'localhost';
  }
  server.listen(loadConfig.node_port, loadConfig.host, () => {
   console.log(`\n\nServer running at http://${loadConfig.host}:${loadConfig.node_port}/`);
  });
} else {
  //Not able to start, show the error and exit
  console.log('Error starting http server!');
  console.log(loadConfig.error_desc);
}
