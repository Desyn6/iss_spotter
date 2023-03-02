const { nextISSTimesForMyLocation } = require('./iss_promised');

nextISSTimesForMyLocation()
  .then((data) => console.log(data))
  .catch((error) => {
    console.log("It didn't work: ", error.message)
  });