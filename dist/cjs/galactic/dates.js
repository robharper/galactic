"use strict";

var Dates;

Dates = {
  msPerDay: 1000 * 60 * 60 * 24,
  J2000: 2451545,
  JUnixEpoch: 2440587.5,
  unixDateToJulian: function(unix) {
    return (unix / Dates.msPerDay) + Dates.JUnixEpoch;
  },
  julianDateToUnix: function(julian) {
    return (julian - Dates.JUnixEpoch) * Dates.msPerDay;
  },
  julianDateToGMST: function(julian) {
    return (18.697374558 + 24.06570982441908 * (julian - Dates.J2000)) % 24;
  }
};

module.exports = Dates;
