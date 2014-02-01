(function() {

  define("galactic/coordinates", ["galactic/dates"], function(Dates) {
    "use strict";

    var Coord, acos, asin, atan, cos, radians, radsPerHour, sin, tan;
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
    return Coord;
  });

}).call(this);
