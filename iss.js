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

module.exports = { fetchMyIP };