const request = require('request-promise-native');


const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchMyCoords = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`http://ipwho.is/${ip}k`);
};

const fetchISSFlyOverTimes = function(body) {
  const latitude = JSON.parse(body).latitude;
  const longitude = JSON.parse(body).longitude;
  return request(`https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`)
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchMyCoords)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const response = JSON.parse(data).response;
      return response
    })
}

module.exports = { nextISSTimesForMyLocation };