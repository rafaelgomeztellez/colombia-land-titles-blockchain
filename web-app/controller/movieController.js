/*
module.exports = function(data) {
  var controller = {};

  controller.getAll = function(request, response) {
    response.send(JSON.stringify(data.getAll(), null, 2));
  };

  controller.get = function(request, resoponse) {
    var id = parseInt(request.params.movieId);

    movie = data.get(id);

    if (movie) {
      response.send(JSON.stringify(movie, null, 2));
    } else {
      response.status(404);
      response.send("not found");
    }
  };

  controller.post = function(request, resoponse) {
    var movie = data.add(request.body);
    response.send(JSON.stringify(movie, null, 2));
  };

  controller.put = function(request, resoponse) {
    var id = parseInt(request.params.movieId);
    var movie = data.update(id, request.body);
    if (movie) {
      response.send(JSON.stringify(movie, null, 2));
    } else {
      response.status(404);
      response.send("not found");
    }
  };

  controller.delete = function(request, resoponse) {
    var id = parseInt(request.params.movieId);
    var movie = data.delete(id);
    if (movie) {
      response.send(JSON.stringify(movie, null, 2));
    } else {
      response.status(404);
      response.send("not found");
    }
  };

  return controller;
};*/

module.exports = function (data) {
    var controller = {};

    controller.getAll = function (request, response) {
        data.getAll(createCallback(response));
    };

    controller.get = function (request, response) {
        var id = parseInt(request.params.movieId);
        data.get(id, createCallback(response));
    };

    controller.post = function (request, response) {
        data.add(request.body, createCallback(response));
    };

    controller.put = function (request, response) {
        var id = parseInt(request.params.movieId);
        data.update(id, request.body, createCallback(response));
    };

    controller.delete = function (request, response) {
        var id = parseInt(request.params.movieId);
        data.remove(id, createCallback(response));
    };
    return controller;
}

function createCallback(response) {
    return function (obj) {
        if (obj) {
            response.send(JSON.stringify(obj, null, 2));
        } else {
            response.status(404);
            response.send("not found");
        }
    }
}