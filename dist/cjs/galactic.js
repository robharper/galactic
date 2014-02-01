"use strict";

var coord, dates, galactic;

galactic = require("./galactic/api");

coord = require("./galactic/coordinates");

dates = require("./galactic/dates");

galactic.coord = coord;

galactic.dates = dates;

module.exports = galactic;
