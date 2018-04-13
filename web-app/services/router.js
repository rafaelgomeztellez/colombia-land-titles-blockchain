const express = require('express');
module.exports = function(movieController){
    var router = express.Router();

    router.route('/')
        .get(movieController.getAll)
        .post(movieController.post);

    router.route('/:movieId')
        .get(movieController.get)
        .put(movieController.put)
        .delete(movieController.delete);
    
    return router;
};