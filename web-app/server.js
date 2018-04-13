
//var server = require('./services/rest-server.js');
//var config = require('./config/config.js');
//var data = require('./data/inmemory.js');

//var router = require('./services/router.js');
//var controller = require('./controller/movieController.js');

//var movieController = controller(data);
//var movieRouter = router(movieController);

//server.start(config, movieRouter);


/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var server = require("./services/rest-server.js");
var config = require("./config/config.js");
var data = require("./data/inmemory.js");

var router = require("./services/router.js");
var controller = require('./controller/movieController.js');

var dataSource = data.open(config);
var movieController = controller(dataSource);
var movieRouter = router(movieController);

server.start(config, movieRouter);
