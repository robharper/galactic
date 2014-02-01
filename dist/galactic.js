!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.galactic=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

var coord, dates, galactic;

galactic = _dereq_("./galactic/api");

coord = _dereq_("./galactic/coordinates");

dates = _dereq_("./galactic/dates");

galactic.coord = coord;

galactic.dates = dates;

module.exports = galactic;

},{"./galactic/api":2,"./galactic/coordinates":3,"./galactic/dates":4}],2:[function(_dereq_,module,exports){
"use strict";

var Coord, Dates, Galactic, GalacticEcliptic, GalacticEquatorial, GalacticHorizontal, galactic,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Dates = _dereq_("./dates");

Coord = _dereq_("./coordinates");

Galactic = (function() {

  function Galactic(coordinate, observer) {
    this._coord = coordinate;
    this._observer = observer;
  }

  Galactic.prototype.observer = function(observer) {
    return new this.constructor(this._coord, observer);
  };

  return Galactic;

})();

GalacticEcliptic = (function(_super) {

  __extends(GalacticEcliptic, _super);

  function GalacticEcliptic(coordinate, observer) {
    GalacticEcliptic.__super__.constructor.call(this, coordinate, observer);
    if (!((this._coord.latitude != null) && (this._coord.longitude != null))) {
      throw "Ecliptic coordinates must have both latidue and longitude specified";
    }
  }

  GalacticEcliptic.prototype.system = function() {
    return 'ecliptic';
  };

  GalacticEcliptic.prototype.latitude = function() {
    return this._coord.latitude;
  };

  GalacticEcliptic.prototype.longitude = function() {
    return this._coord.longitude;
  };

  GalacticEcliptic.prototype.ecliptic = function(observer) {
    return new this.constructor(this._coord, observer != null ? observer : this._observer);
  };

  GalacticEcliptic.prototype.equatorial = function(observer) {
    return new GalacticEquatorial(Coord.eclipticToEquatorial(this._coord, observer != null ? observer : this._observer), observer != null ? observer : this._observer);
  };

  GalacticEcliptic.prototype.horizontal = function(observer) {
    return this.equatorial().horizontal(observer);
  };

  return GalacticEcliptic;

})(Galactic);

GalacticEquatorial = (function(_super) {

  __extends(GalacticEquatorial, _super);

  function GalacticEquatorial(coordinate, observer) {
    GalacticEquatorial.__super__.constructor.call(this, coordinate, observer);
    if (!((this._coord.declination != null) && ((this._coord.rightAscension != null) || (this._coord.hourAngle != null)))) {
      throw "Equatoric coordinates must have declination and one of right ascension or hour angle specified";
    }
  }

  GalacticEquatorial.prototype.system = function() {
    return 'equatorial';
  };

  GalacticEquatorial.prototype.declination = function() {
    return this._coord.declination;
  };

  GalacticEquatorial.prototype.rightAscension = function() {
    var localSidereal, _ref;
    if (this._coord.rightAscension != null) {
      return this._coord.rightAscension;
    } else {
      localSidereal = (_ref = this._observer.localSidereal) != null ? _ref : Coord.utcToLocalSidereal(this._observer);
      return Coord.hourAngleToRightAscension(this._coord.hourAngle, localSidereal);
    }
  };

  GalacticEquatorial.prototype.hourAngle = function() {
    var localSidereal, _ref;
    if (this._coord.hourAngle != null) {
      return this._coord.hourAngle;
    } else {
      localSidereal = (_ref = this._observer.localSidereal) != null ? _ref : Coord.utcToLocalSidereal(this._observer);
      return Coord.rightAscensionToHourAngle(this._coord.rightAscension, localSidereal);
    }
  };

  GalacticEquatorial.prototype.observer = function(observer) {
    var localSidereal, rightAscension, _ref;
    if (this._coord.hourAngle != null) {
      localSidereal = (_ref = this._observer.localSidereal) != null ? _ref : Coord.utcToLocalSidereal(this._observer);
      rightAscension = Coord.hourAngleToRightAscension(this._coord.hourAngle, localSidereal);
      return new this.constructor({
        declination: this._coord.declination,
        rightAscension: rightAscension
      }, observer);
    } else {
      return new this.constructor(this._coord, observer);
    }
  };

  GalacticEquatorial.prototype.ecliptic = function(observer) {
    return new GalacticEcliptic(Coord.equatorialToEcliptic(this._coord, observer != null ? observer : this._observer), observer != null ? observer : this._observer);
  };

  GalacticEquatorial.prototype.equatorial = function(observer) {
    return new this.constructor(this._coord, observer != null ? observer : this._observer);
  };

  GalacticEquatorial.prototype.horizontal = function(observer) {
    return new GalacticHorizontal(Coord.equatorialToHorizontal(this._coord, observer != null ? observer : this._observer), observer != null ? observer : this._observer);
  };

  return GalacticEquatorial;

})(Galactic);

GalacticHorizontal = (function(_super) {

  __extends(GalacticHorizontal, _super);

  function GalacticHorizontal(coordinate, observer) {
    GalacticHorizontal.__super__.constructor.call(this, coordinate, observer);
    if (!((this._coord.altitude != null) && (this._coord.azimuth != null))) {
      throw "Equatoric coordinates must have declination and one of right ascension or hour angle specified";
    }
  }

  GalacticHorizontal.prototype.system = function() {
    return 'horizontal';
  };

  GalacticHorizontal.prototype.altitude = function() {
    return this._coord.altitude;
  };

  GalacticHorizontal.prototype.azimuth = function() {
    return this._coord.azimuth;
  };

  GalacticHorizontal.prototype.observer = function(observer) {
    return this.equatorial().horizontal(observer);
  };

  GalacticHorizontal.prototype.ecliptic = function(observer) {
    return this.equatorial(observer).ecliptic();
  };

  GalacticHorizontal.prototype.equatorial = function(observer) {
    return new GalacticEquatorial(Coord.horizontalToEquatorial(this._coord, observer != null ? observer : this._observer), observer != null ? observer : this._observer);
  };

  GalacticHorizontal.prototype.horizontal = function(observer) {
    return new this.constructor(this._coord, observer != null ? observer : this._observer);
  };

  return GalacticHorizontal;

})(Galactic);

galactic = function(coordinate, observer) {
  if ((coordinate.latitude != null) && (coordinate.longitude != null)) {
    return new GalacticEcliptic(coordinate, observer);
  } else if (coordinate.declination != null) {
    return new GalacticEquatorial(coordinate, observer);
  } else if ((coordinate.altitude != null) && (coordinate.azimuth != null)) {
    return new GalacticHorizontal(coordinate, observer);
  }
};

module.exports = galactic;

},{"./coordinates":3,"./dates":4}],3:[function(_dereq_,module,exports){
"use strict";

var Coord, Dates, acos, asin, atan, cos, radians, radsPerHour, sin, tan;

Dates = _dereq_("./dates");

atan = Math.atan2;

acos = Math.acos;

asin = Math.asin;

tan = Math.tan;

cos = Math.cos;

sin = Math.sin;

radians = function(deg) {
  return deg / 180 * Math.PI;
};

radsPerHour = radians(360 / 24);

Coord = {
  EARTH: {
    obliquity: radians(23.439)
  },
  utcToLocalSidereal: function(observer) {
    return Dates.julianDateToGMST(Dates.unixDateToJulian(observer.utc)) * radsPerHour + observer.longitude;
  },
  hourAngleToRightAscension: function(hourAngle, localSidereal) {
    return localSidereal - hourAngle;
  },
  rightAscensionToHourAngle: function(rightAscension, localSidereal) {
    return localSidereal - rightAscension;
  },
  eclipticToEquatorial: function(coord) {
    var latitude, longitude, obliquity;
    latitude = coord.latitude;
    longitude = coord.longitude;
    obliquity = coord.obliquity || Coord.EARTH.obliquity;
    return {
      declination: asin(sin(latitude) * cos(obliquity) + cos(latitude) * sin(obliquity) * sin(longitude)),
      rightAscension: atan(sin(longitude) * cos(obliquity) - tan(latitude) * sin(obliquity), cos(longitude))
    };
  },
  equatorialToEcliptic: function(coord, observer) {
    var declination, obliquity, rightAscension, _ref;
    if (observer == null) {
      observer = {};
    }
    declination = coord.declination;
    rightAscension = coord.rightAscension;
    obliquity = coord.obliquity || Coord.EARTH.obliquity;
    if (rightAscension == null) {
      if ((_ref = observer.localSidereal) == null) {
        observer.localSidereal = Coord.utcToLocalSidereal(observer);
      }
      rightAscension = Coord.hourAngleToRightAscension(coord.hourAngle, observer.localSidereal);
    }
    return {
      latitude: asin(sin(declination) * cos(obliquity) - cos(declination) * sin(obliquity) * sin(rightAscension)),
      longitude: atan(sin(rightAscension) * cos(obliquity) + tan(declination) * sin(obliquity), cos(rightAscension))
    };
  },
  equatorialToHorizontal: function(coord, observer) {
    var declination, hourAngle, latitude, localSidereal, rightAscension;
    declination = coord.declination;
    hourAngle = coord.hourAngle;
    rightAscension = coord.rightAscension;
    latitude = observer.latitude;
    localSidereal = observer.localSidereal;
    if (hourAngle == null) {
      if (localSidereal == null) {
        localSidereal = Coord.utcToLocalSidereal(observer);
      }
      hourAngle = Coord.rightAscensionToHourAngle(rightAscension, localSidereal);
    }
    return {
      altitude: asin(sin(latitude) * sin(declination) + cos(latitude) * cos(declination) * cos(hourAngle)),
      azimuth: Math.PI + atan(sin(hourAngle), cos(hourAngle) * sin(latitude) - tan(declination) * cos(latitude))
    };
  },
  horizontalToEquatorial: function(coord, observer) {
    var altitude, azimuth, hourAngle, latitude, localSidereal, utc;
    altitude = coord.altitude;
    azimuth = coord.azimuth - Math.PI;
    latitude = observer.latitude;
    localSidereal = observer.localSidereal;
    utc = observer.utc;
    if (localSidereal == null) {
      localSidereal = Coord.utcToLocalSidereal(observer);
    }
    hourAngle = atan(sin(azimuth), cos(azimuth) * sin(latitude) + tan(altitude) * cos(latitude));
    return {
      declination: asin(sin(latitude) * sin(altitude) - cos(latitude) * cos(altitude) * cos(azimuth)),
      hourAngle: hourAngle,
      rightAscension: hourAngleToRightAscension(hourAngle, localSidereal)
    };
  }
};

module.exports = Coord;

},{"./dates":4}],4:[function(_dereq_,module,exports){
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

},{}]},{},[1])
(1)
});