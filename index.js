const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, passbys) => {
  if (error) {
    return console.log("It didn't work!", error);
  }

  for (const passby of passbys) {
    const dateTime = new Date(0);
    dateTime.setUTCSeconds(passby.risetime);
    const duration = passby.duration;
    console.log(`Next passby at ${dateTime} for ${duration} seconds.`);
  }
});

// old index.js code up to ISS IV
// const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   console.log('It worked! Returned IP:' , ip);
// });

// // test ip address
// const ip = '64.180.195.1';
// fetchCoordsByIP(ip, (err, loc) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(`Success! Coordinates:`, loc);
//   }
// });

// // test fetch location
// const coords = { latitude: 49.2488091, longitude: -122.9805104 };
// fetchISSFlyOverTimes(coords, (err, passbys) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(passbys);
//   }
// });