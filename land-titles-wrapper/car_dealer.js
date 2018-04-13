const config = require('./bcs_config');
const request = require('request');

const bcs_uri = "http://" +config.endpoint.host +":" +config.endpoint.port +config.endpoint.path

module.exports = function(app) {

  app.post('/cars', function(req,res) {
    //Validate the request payload
    var car = req.body
    if(!car || typeof car !== 'object' || !car.plate || car.plate.length === 0 || !car.color || !car.model || !car.manufacturer || !car.year ){
      res.status(400).send("Error: plate, color, model, manufacturer and year are mandatory fields.");
      return;
    }
    //Pull the dealer info from the headers
    var owner = req.get('owner');
    if(!owner){
      res.status(400).send("Error: missing owner header!");
      return;
    }
    //Assemble arguments for bcs API
    var args = [owner, car.plate, car.color, car.model, car.manufacturer, car.year, (car.description ? car.description : ""), (car.condition ? car.condition : "unknown")];
    var body = { channel: config.channel,
                 chaincode: config.chaincode.name,
                 method: "initVehicle",
                 args: args,
                 chaincodeVer: config.chaincode.version
               };
    var options = { url: bcs_uri +"/invocation",
                    method: "POST",
                    headers: {
                      "Content-Type":"application/json"
                    },
                    body: JSON.stringify(body)
                  };
    request(options, function(err, response, body){
      if(err){
        console.log(err);
        res.status(500).send(err);
        return;
      }
      //Otherwise parse the response.
      var jsonBody;
      try{
        jsonBody = JSON.parse(body);
      }catch (ex){
        console.log(ex);
        res.status(500).send("Error parsing response from blockchain.");
        return;
      }
      if(jsonBody.returnCode && jsonBody.returnCode === "Success"){
        res.status(204).end();
        return;
      }
      if(jsonBody.info && jsonBody.info.includes("description=chaincode error")){
        //This is a chaincode error, and we have to somehow pull the error message out of it...
        var patt = new RegExp("\\(status: [\\d]{3}, message: ([^)]*)");
        var errorMsg = patt.exec(jsonBody.info);
        if(errorMsg.length >= 2){
          if(errorMsg[1].includes("already exist")){
            res.status(409).send("Error: " +errorMsg[1]);
            return;
          }else{
            res.status(500).send("Error: " +errorMsg[1]);
            return;
          }
        }
      }
      res.status(500).send("Error: " +(jsonBody.info ? jsonBody.info : "Unknown error response from blockchain"));
    });
  });

  app.get('/cars', function(req,res) {
    //Assemble arguments for bcs API
    var args = [req.query.color && typeof req.query.color === 'string' ? req.query.color : "",
                req.query.manufacturer && typeof req.query.manufacturer === 'string' ? req.query.manufacturer : "",
                req.query.model && typeof req.query.model === 'string' ? req.query.model : "",
                req.query.year && typeof req.query.year === 'string' ? req.query.year : ""
               ];
    var body = { channel: config.channel,
                 chaincode: config.chaincode.name,
                 method: "getVehiclesWithFilter",
                 args: args,
                 chaincodeVer: config.chaincode.version
               };
    var options = { url: bcs_uri +"/query",
                    method: "POST",
                    headers: {
                      "Content-Type":"application/json"
                    },
                    body: JSON.stringify(body)
                  };
    request(options, function(err, response, body){
      if(err){
        console.log(err);
        res.status(500).send(err);
        return;
      }
      //Otherwise parse the response.
      var jsonBody;
      try{
        jsonBody = JSON.parse(body);
      }catch (ex){
        console.log(ex);
        res.status(500).send("Error parsing response from blockchain.");
        return;
      }
      if(jsonBody.returnCode && jsonBody.returnCode === "Success"){
        //parse the cars we received back
        try{
          var cars = JSON.parse(jsonBody.result);
          res.status(200).json(cars);
          return;
        }catch(ex){
          console.log(ex);
          res.status(500).send("Malformed object received from blockchain")
          return;
        }
      }
      //There is actually not an error message returned on query... Odd.
      //default to 500, probably hiding some bad behaviour
      res.status(500).send("Unknown blockchain error");
    });
  });

  app.get('/cars/:carId', function(req,res) {
    //Assemble arguments for bcs API
    var args = [req.params.carId];
    var body = { channel: config.channel,
                 chaincode: config.chaincode.name,
                 method: "getVehicle",
                 args: args,
                 chaincodeVer: config.chaincode.version
               };
    var options = { url: bcs_uri +"/query",
                    method: "POST",
                    headers: {
                      "Content-Type":"application/json"
                    },
                    body: JSON.stringify(body)
                  };
    request(options, function(err, response, body){
      if(err){
        console.log(err);
        res.status(500).send(err);
        return;
      }
      //Otherwise parse the response.
      var jsonBody;
      try{
        jsonBody = JSON.parse(body);
      }catch (ex){
        console.log(ex);
        res.status(500).send("Error parsing response from blockchain.");
        return;
      }
      if(jsonBody.returnCode && jsonBody.returnCode === "Success"){
        //parse the car we received back
        try{
          var car = JSON.parse(jsonBody.result);
          res.status(200).json(car);
          return;
        }catch(ex){
          console.log(ex);
          res.status(500).send("Malformed object received from blockchain")
          return;
        }
      }
      //There is actually not an error message returned on query... Odd.
      //default to 404, probably hiding some bad behaviour
      res.status(404).send("Vehicle not found.");
    });
  });

  app.get('/cars/:carId/history', function(req,res) {
    //Assemble arguments for bcs API
    var args = [req.params.carId];
    var body = { channel: config.channel,
                 chaincode: config.chaincode.name,
                 method: "getHistoryForVehicle",
                 args: args,
                 chaincodeVer: config.chaincode.version
               };
    var options = { url: bcs_uri +"/query",
                    method: "POST",
                    headers: {
                      "Content-Type":"application/json"
                    },
                    body: JSON.stringify(body)
                  };
    request(options, function(err, response, body){
      if(err){
        console.log(err);
        res.status(500).send(err);
        return;
      }
      //Otherwise parse the response.
      var jsonBody;
      try{
        jsonBody = JSON.parse(body);
      }catch (ex){
        console.log(ex);
        res.status(500).send("Error parsing response from blockchain.");
        return;
      }
      if(jsonBody.returnCode && jsonBody.returnCode === "Success"){
        //parse the car we received back
        try{
          var history = JSON.parse(jsonBody.result);
          res.status(200).json(history);
          return;
        }catch(ex){
          console.log(ex);
          res.status(500).send("Malformed object received from blockchain")
          return;
        }
      }
      //There is actually not an error message returned on query... Odd.
      //default to 404, probably hiding some bad behaviour
      res.status(404).send("Vehicle not found.");
    });
  });

  app.put('/cars/:carId/owner', function(req,res) {
    //Validate the request payload
    if(!req.body || typeof req.body !== 'object'){
      res.status(400).send("Error: Empty body!");
      return;
    }
    //Pull the dealer info from the headers
    var owner = req.get('owner');
    if(!owner){
      res.status(400).send("Error: missing owner header!");
      return;
    }
    //Assemble arguments for bcs API
    var args = [req.params.carId, owner];
    if(req.body.new_owner){
      args.push(req.body.new_owner);
    }
    var body = { channel: config.channel,
                 chaincode: config.chaincode.name,
                 method: "transferVehicle",
                 args: args,
                 chaincodeVer: config.chaincode.version
               };
    var options = { url: bcs_uri +"/invocation",
                    method: "POST",
                    headers: {
                      "Content-Type":"application/json"
                    },
                    body: JSON.stringify(body)
                  };
    request(options, function(err, response, body){
      if(err){
        console.log(err);
        res.status(500).send(err);
        return;
      }
      //Otherwise parse the response.
      var jsonBody;
      try{
        jsonBody = JSON.parse(body);
      }catch (ex){
        console.log(ex);
        res.status(500).send("Error parsing response from blockchain.");
        return;
      }
      if(jsonBody.returnCode && jsonBody.returnCode === "Success"){
        res.status(204).end();
        return;
      }
      if(jsonBody.info && jsonBody.info.includes("description=chaincode error")){
        //This is a chaincode error, and we have to somehow pull the error message out of it...
        var patt = new RegExp("\\(status: [\\d]{3}, message: ([^)]*)");
        var errorMsg = patt.exec(jsonBody.info);
        if(errorMsg.length >= 2){
          if(errorMsg[1].includes("another entity")){
            res.status(401).send("Error: " +errorMsg[1]);
            return;
          }else{
            res.status(500).send("Error: " +errorMsg[1]);
            return;
          }
        }
      }
      res.status(500).send("Error: " +(jsonBody.info ? jsonBody.info : "Unknown error response from blockchain"));
    });
  });
};
