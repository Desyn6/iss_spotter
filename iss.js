const request = require('request');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  const url = 'https://api.ipify.org?format=json';
  request(url, (error, response, body) => {
    let parsedBody = JSON.parse(body);
    
    // catch errors
    if (error) {
      return callback(error, null);
    }

    // catch non-200 status codes
    if (response.statusCode !== 200) {
      const msg = `Status Code: ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(msg, null);
    }

    // catch falsy values
    parsedBody = ((!parsedBody) ? "ip not found" : parsedBody.ip);
    callback(null, parsedBody);
  });
};

// iss.js
/**
 * Makes a single API request to retrieve the lat/lng for a given IPv4 address.
 * Input:
 *   - The ip (ipv4) address (string)
 *   - A callback (to pass back an error or the lat/lng object)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The lat and lng as an object (null if error). Example:
 *     { latitude: '49.27670', longitude: '-123.13000' }
 */
const fetchCoordsByIP = function(ip, callback) {
  const url = 'http://ipwho.is/' + ip;
  request(url, (error, response, body) => {
    // catch errors
    if (error) {
      return callback(error, null);
    }

    // catch non-200 status codes
    if (response.statusCode !== 200) {
      const msg = `Status Code: ${response.statusCode} when fetching location. Response: ${body}`;
      return callback(msg, null);
    }

    // parse the body only if no errors or status code errors
    let parsedBody = JSON.parse(body);

    // check for success message from server
    if (!parsedBody.success) {
      const msg = `ip address [${ip}], is invalid`;
      return callback(msg, null);
    }

    // catch falsy values
    const location = ((!parsedBody) ? "location not found" : {"latitude": parsedBody.latitude, "longitude": parsedBody.longitude});
    
    callback(null, location);
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  // ...
  request(url, (error, response, body) => {
    // catch errors
    if (error) {
      return callback(error, null);
    }

    // catch non-200 status codes
    if (response.statusCode !== 200) {
      const msg = `Status Code: ${response.statusCode} when fetching flyovers. Response: ${body}`;
      return callback(msg, null);
    }

    // parse the body only if no errors or status code errors
    let parsedBody = JSON.parse(body);

    // check for success message from server
    if (parsedBody.message !== "success") {
      const msg = `Could not fetch passovers.`;
      return callback(msg, null);
    }

    // catch falsy values
    const passbys = ((!parsedBody) ? "No passbys found." : parsedBody.response);
    
    callback(null, passbys);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPass) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPass);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };