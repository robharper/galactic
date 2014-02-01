(function() {

  define("galactic", ["galactic/api", "galactic/coordinates", "galactic/dates"], function(galactic, coord, dates) {
    "use strict";
    galactic.coord = coord;
    galactic.dates = dates;
    return galactic;
  });

}).call(this);
