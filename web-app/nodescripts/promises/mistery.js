function mistery() {
  return new Promise(function(f1, f2) {
    f2("mistery");
  });
}

mistery()
  .then(function(result) {
    console.log("A " + result);

    return new Promise(function(resolve, reject) {
      resolve("solved!");
    });
  })

  .then(function(result) {
    console.log("B " + result);
  })

  .catch(function(err) {
    console.log("ERR: " + err);
  });
