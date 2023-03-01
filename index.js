// index.js
const { fetchMyIP, fetchCoordsByIP } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }
  console.log('It worked! Returned IP:' , ip);
});

// test ip address
const ip = '64.180.195.1';
fetchCoordsByIP(ip, (err, loc) => {
  if (err) {
    console.log(error);
  } else {
    console.log(`Success! Coordinates:`, loc);
  }
});