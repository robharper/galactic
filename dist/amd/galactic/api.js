(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define("galactic/api", ["galactic/dates", "galactic/coordinates"], function(Dates, Coord) {
    "use strict";

    var Galactic, GalacticEcliptic, GalacticEquatorial, GalacticHorizontal, galactic;
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
    return galactic;
  });

}).call(this);
