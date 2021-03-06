import './dates' as Dates
import './coordinates' as Coord


#
#
#
class Galactic
  constructor: (coordinate, observer) ->
    @_coord = coordinate
    @_observer = observer

  observer: (observer) ->
    # Copy - no transformation by default
    new @constructor(@_coord, observer)



#
#
#
class GalacticEcliptic extends Galactic
  constructor: (coordinate, observer) ->
    super(coordinate, observer)
    throw "Ecliptic coordinates must have both latidue and longitude specified" unless @_coord.latitude? and @_coord.longitude?

  system: -> 'ecliptic'

  latitude: -> @_coord.latitude

  longitude: -> @_coord.longitude

  # observer: Identity transform - ecliptic doesn't depend on observer

  # Conversions
  #
  # Return new Galactic objects in new coordinate system
  ecliptic: (observer) ->
    @observer(observer ? @_observer)

  equatorial: (observer) ->
    new GalacticEquatorial(Coord.eclipticToEquatorial(@_coord, observer ? @_observer), observer ? @_observer)

  horizontal: (observer) ->
    @equatorial().horizontal(observer)





#
#
#
class GalacticEquatorial extends Galactic
  constructor: (coordinate, observer) ->
    super(coordinate, observer)
    throw "Equatoric coordinates must have declination and one of right ascension or hour angle specified" unless @_coord.declination? and (@_coord.rightAscension? or @_coord.hourAngle?)

  system: -> 'equatorial'

  declination: -> @_coord.declination

  rightAscension: ->
    if @_coord.rightAscension?
      @_coord.rightAscension 
    else
      # TODO validation error if no/incomplete observer
      localSidereal = @_observer.localSidereal ? Coord.utcToLocalSidereal(@_observer)
      Coord.hourAngleToRightAscension(@_coord.hourAngle, localSidereal)

  hourAngle: ->
    if @_coord.hourAngle?
      @_coord.hourAngle 
    else
      # TODO validation error if no/incomplete observer
      localSidereal = @_observer.localSidereal ? Coord.utcToLocalSidereal(@_observer)
      Coord.rightAscensionToHourAngle(@_coord.rightAscension, localSidereal)

  # Creates a copy of this coordinate with a different observer
  observer: (observer) ->
    if @_coord.hourAngle?
      # hourAngle is observer-specific, must use observer-independent rightAscension first
      new @constructor(declination: @_coord.declination, rightAscension: @rightAscension(), observer)
    else
      # Copy
      new @constructor(@_coord, observer)

  # Conversions
  #
  # Return new Galactic objects in new coordinate system
  ecliptic: (observer) ->
    new GalacticEcliptic(Coord.equatorialToEcliptic(@_coord, observer ? @_observer), observer ? @_observer)

  equatorial: (observer) ->
    @observer(observer ? @_observer)
 
  horizontal: (observer) ->
    if observer?
      # Transform current view to new observer before coord transform
      # Ensures that observer-specific information like hour angle doesn't affect transform
      @observer(observer).horizontal()
    else
      new GalacticHorizontal(Coord.equatorialToHorizontal(@_coord, observer ? @_observer), observer ? @_observer)
  




#
#
#
class GalacticHorizontal extends Galactic
  constructor: (coordinate, observer) ->
    super(coordinate, observer)
    throw "Equatoric coordinates must have declination and one of right ascension or hour angle specified" unless @_coord.altitude? and @_coord.azimuth?

  system: -> 'horizontal'

  altitude: -> @_coord.altitude

  azimuth: -> @_coord.azimuth

  # Creates a copy of this coordinate with a different observer
  observer: (observer) ->
    # Convert via transit through equatorial (to equatorial in current system)
    @equatorial().horizontal(observer)

  # Conversions
  #
  # Return new Galactic objects in new coordinate system
  ecliptic: (observer) ->
    @equatorial(observer).ecliptic()

  equatorial: (observer) ->
    new GalacticEquatorial(Coord.horizontalToEquatorial(@_coord, observer ? @_observer), observer ? @_observer)

  horizontal: (observer) ->
    @observer(observer ? @_observer)
 


        

galactic = (coordinate, observer) ->
  if coordinate.latitude? and coordinate.longitude?
    new GalacticEcliptic(coordinate, observer)
  else if coordinate.declination?
    new GalacticEquatorial(coordinate, observer)
  else if coordinate.altitude? and coordinate.azimuth?
    new GalacticHorizontal(coordinate, observer)

export = galactic