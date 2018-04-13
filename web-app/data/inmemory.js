/*var rawMovies = require("./movies.json");

var moviesById = {};

var currentId = 100;

//Se agregan las movies indexadas en la collection de moviesById

//rawMovies.array.forEach(element => {
  //  var id = currentId;
    //movie.id = id;
    //moviesById[id] = movie;
//});


rawMovies.forEach(function(movie) {
  var id = currentId++;
  movie.id = id;
  moviesById[id] = movie;
});

module.exports.getAll = function() {
  var summary = [];

  for (var id in moviesById) {
    var movie = moviesById[id];
    summary.push({
      id: movie.id,
      name: movie.name,
      year: movie.year,
      studio: movie.studio,
      genre: movie.genre,
      rating: movie.rating,
      runtime: movie.runtime,
      director: movie.director,
      description: movie.description,
      score: (
        movie.reviews
          .map(function(r) {
            return r.score;
          })
          .reduce(function(a, b) {
            return a + b;
          }, 0) / movie.reviews.length
      ).toPrecision(3),
      reviews: movie.reviews.length
    });
  }
  return summary;
};

module.exports.getId = function(id) {
  return moviesById[id];
};

module.exports.add = function(movie) {
  var id = currentId++;
  movie.id = id;
  moviesById[id] = movie;
  return movie;
};

module.exports.update = function(id, movie) {
  if (!isNaN(id) && moviesById[id]) {
    movie.id = id;
    moviesById[id] = movie;
    return movie;
  }
};

module.exports.remove = function(id) {
    if (!isNaN(id) && moviesById[id]) {        
        var movie = moviesById[id];
        delete moviesById[id];
        return movie;
      }
};
*/

/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var rawmovies = require('./movies.json');
// index by id, this uses a dual collection aproach, an array and an object by index.
var moviesById = {};

var currentId = 100;

rawmovies.forEach(function (movie) {
    var id = currentId++;
    movie.id = id;
    moviesById[id] = movie;
});

module.exports.open = function (config) {
    var datasource = {};

    datasource.getAll = function (callback) {
        var summary = [];
        for (id in moviesById) {
            var movie = moviesById[id];
            summary.push({
                id: movie.id,
                name: movie.name,
                year: movie.year,
                studio: movie.studio,
                genre: movie.genre,
                rating: movie.rating,
                runtime: movie.runtime,
                director: movie.director,
                description: movie.description,
                score: movie.reviews ? (movie.reviews.map(function (r) {
                    return r.score;
                }).reduce(function (a, b) {
                    return a + b;
                }, 0) / movie.reviews.length).toPrecision(3) : 0,
                reviews: movie.reviews ? movie.reviews.length : 0
            });
        }
        callback(summary);
    }

    datasource.get = function (id, callback) {
        callback(moviesById[id]);
    }

    datasource.add = function (movie, callback) {
        var id = currentId++;
        movie.id = id;
        moviesById[id] = movie;
        callback(movie);
    }

    datasource.update = function (id, movie, callback) {
        if (!isNaN(id) && moviesById[id]) {
            movie.id = id;
            moviesById[id] = movie;
            callback(movie);
        } else {
            callback();
        }
    }

    datasource.remove = function (id, callback) {
        if (!isNaN(id) && moviesById[id]) {
            var movie = moviesById[id];
            delete moviesById[id];
            callback(movie);
        } else {
            callback();
        }
    }
    return datasource;
}