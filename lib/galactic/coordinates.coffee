import './dates' as Dates

# Utilities
atan = Math.atan2
acos = Math.acos
asin = Math.asin
tan = Math.tan
cos = Math.cos
sin = Math.sin

radians = (deg) ->
  deg/180*Math.PI

# Constants
radsPerHour = radians(360/24)


Coord =

  EARTH:
    obliquity: radians(23.439)


  utcToLocalSidereal: (observer) ->
    Dates.julianDateToGMST(Dates.unixDateToJulian(observer.utc)) * radsPerHour - observer.longitude

  hourAngleToRightAscension: (hourAngle, localSidereal) ->
    localSidereal - hourAngle

  rightAscensionToHourAngle: (rightAscension, localSidereal) ->
    localSidereal - rightAscension

  #
  # Coordinate System Transformations:
  #

  #
  # Ecliptic to Equatorial
  # In: longitude, latitude
  # Out: declication, right ascension, (obliquity used in calculation is also given)
  #
  eclipticToEquatorial: (coord) ->
    latitude = coord.latitude
    longitude = coord.longitude
    obliquity = coord.obliquity || Coord.EARTH.obliquity
    {
      declination: asin( sin(latitude)*cos(obliquity) + cos(latitude)*sin(obliquity)*sin(longitude) )
      rightAscension: atan( sin(longitude)*cos(obliquity) - tan(latitude)*sin(obliquity), cos(longitude) )
    }

  #
  # Equatorial to Ecliptic
  # In:
  #  - declination
  #  - rightAscension or hour angle
  #
  # If hour angle is provided instead of right ascension, an observer with either of the following properties is required:
  #  - local sidereal time, or 
  #  - longitude & utc time
  #
  # Out:
  #  - latitude
  #  - longitude
  #
  equatorialToEcliptic: (coord, observer={}) ->
    declination = coord.declination
    rightAscension = coord.rightAscension
    obliquity = coord.obliquity || Coord.EARTH.obliquity

    unless rightAscension?
      # Calculate right ascension from hour angle + observer if necessary
      observer.localSidereal ?= Coord.utcToLocalSidereal(observer)
      rightAscension = Coord.hourAngleToRightAscension(coord.hourAngle, observer.localSidereal)

    {
      latitude: asin( sin(declination)*cos(obliquity) - cos(declination)*sin(obliquity)*sin(rightAscension) )
      longitude: atan( sin(rightAscension)*cos(obliquity) + tan(declination)*sin(obliquity), cos(rightAscension) )
    }

  #
  # Converts an equatorial coordinate to horizontal coordinate given an observer's location on the planet
  # In:
  #  - Coordinate:
  #    - declination
  #    - rightAscension or hour angle
  #  - Observer:
  #    - latitude
  #    - longitude
  #    - utc time of observation
  #
  # Observer's longitude and utc time can be subsituted by local sidereal time. Furthermore, if the coordinate's
  # hour angle is provided instead of right ascension, only the observer's latitude is needed
  #
  equatorialToHorizontal: (coord, observer) ->
    # Required
    declination = coord.declination      

    # Either hourAngle
    # or rightAscension plus localSidereal/longitude+time are needed
    hourAngle = coord.hourAngle
    rightAscension = coord.rightAscension

    # Observer    
    latitude = observer.latitude
    localSidereal = observer.localSidereal
    longitude = observer.longitude
    utc = observer.utc

    unless hourAngle?
      localSidereal ?= Coord.utcToLocalSidereal(observer)
      hourAngle = Coord.rightAscensionToHourAngle(rightAscension, localSidereal)

    {
      altitude: asin( sin(latitude)*sin(declination) + cos(latitude)*cos(declination)*cos(hourAngle) )
      azimuth: atan( sin(hourAngle), cos(hourAngle)*sin(latitude) - tan(declination)*cos(latitude) )
    }

  #
  # Converts horiztonal coordinates into equatorial given the location of the observer for which the horizontal
  # coordinates apply
  #
  # In: 
  #  - Coordinate:
  #    - Altitude
  #    - Azimuth
  #  - Observer
  #    - latitude
  #    - longitude
  #    - utc time of observation
  #
  # Observer's longitude and utc time can be subsituted by local sidereal time.
  #
  horizontalToEquatorial: (coord, observer) ->
    # Required
    altitude = coord.altitude      
    azimuth = coord.azimuth

    # Observer
    latitude = observer.latitude
    # Local Sidereal or longitude+utc are required
    localSidereal = observer.localSidereal
    longitude = observer.longitude
    utc = observer.utc

    localSidereal ?= Coord.utcToLocalSidereal(observer)
    hourAngle = atan( sin(azimuth), cos(azimuth)*sin(latitude) + tan(altitude)*cos(latitude) )
    {
      declination: asin( sin(latitude)*sin(altitude) - cos(latitude)*cos(altitude)*cos(azimuth) )
      hourAngle: hourAngle
      rightAscension: hourAngleToRightAscension(hourAngle, localSidereal)
    }

export = Coord
