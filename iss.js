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
module.exports = { fetchMyIP, fetchCoordsByIP };