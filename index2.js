const { fetchMyIP, fetchMyCoords, nextISSTimesForMyLocation } = require('./iss_promised');

fetchMyIP()
  .then(fetchMyCoords)
  .then(nextISSTimesForMyLocation)
  .then(body => console.log(body));
