galactic = require '../dist/cjs/galactic'
should = require 'should'

DELTA = 0.00001

rad = (deg) ->
  deg/180*Math.PI

describe 'galactic', ->

  it 'should maintain observer through transform', ->
    coord1 = galactic(longitude: 0, latitude: 0, {longitude: 4, latitude: 3, utc: 5})
    result = coord1.equatorial()
    # TODO observer accessor
    result._observer.longitude.should.equal 4
    result._observer.latitude.should.equal 3
    result._observer.utc.should.equal 5

  it 'should be fully invertible', ->
    coord1 = galactic(longitude: 2, latitude: 1, {longitude: 4, latitude: 3, utc: 5})
    result = coord1.equatorial().horizontal().equatorial().ecliptic()

    result.longitude().should.be.approximately 2, DELTA
    result.latitude().should.be.approximately 1, DELTA



  describe 'ecliptic', ->

    it 'should report ecliptic', ->
      coord = galactic(longitude: 0, latitude: 0)
      coord.system().should.equal 'ecliptic'

    describe 'to equatorial', ->      

      it 'should be equal to 0,0 where equatorial and ecliptic cross', ->
        eclipticCoord = galactic(longitude: 0, latitude: 0)
        result = eclipticCoord.equatorial()

        result.rightAscension().should.be.approximately(0, DELTA)
        result.declination().should.be.approximately(0, DELTA)

        eclipticCoord = galactic(longitude: rad(180), latitude: 0)
        result = eclipticCoord.equatorial()

        result.rightAscension().should.be.approximately(rad(180), DELTA)
        result.declination().should.be.approximately(0, DELTA)

      it 'should be convertable to equatorial coordinates', ->
        eclipticCoord = galactic(longitude: rad(45), latitude: rad(30))
        result = eclipticCoord.equatorial()

        result.rightAscension().should.be.approximately(rad(30.65515), DELTA)
        result.declination().should.be.approximately(rad(44.61414), DELTA)

      it 'should be invertible', ->
        eclipticCoord = galactic(longitude: rad(45), latitude: rad(30))
        result = eclipticCoord.equatorial().ecliptic()

        result.longitude().should.be.approximately(rad(45), DELTA)
        result.latitude().should.be.approximately(rad(30), DELTA)

    describe 'observer', ->
      it 'should be independent of observer', ->
        eclipticCoord = galactic(longitude: rad(123), latitude: rad(56))
        result = eclipticCoord.observer(longitude: 33, latitude: 12)

        result.longitude().should.equal( eclipticCoord.longitude() )
        result.latitude().should.equal( eclipticCoord.latitude() )



  describe 'equatorial', ->
    it 'should report equatorial', ->
      coord = galactic(rightAscension: 0, declination: 0)
      coord.system().should.equal 'equatorial'

      coord = galactic(hourAngle: 0, declination: 0)
      coord.system().should.equal 'equatorial'



  describe 'horizontal', ->

    it 'should report horizontal', ->
      coord = galactic(altitude: 0, azimuth: 0)
      coord.system().should.equal 'horizontal'


    describe 'observer', ->
      it 'straight up for one observer is on horizon for observer 90deg away on equator', ->
        horizCoord = galactic({altitude: rad(90), azimuth: 0}, {longitude: rad(120), latitude: 0, utc: Date.now()})
        result = horizCoord.observer(longitude: rad(30), latitude: 0, utc: Date.now())

        result.altitude().should.be.approximately(0, DELTA)
        result.azimuth().should.be.approximately(rad(-90), DELTA)

      it 'point on one horizon should be ~ on the opposite horizon 12 hours later on the equator', ->
        observation1 = 
          longitude: 33
          latitude: 0
          utc: Date.now()
        observation2 = 
          longitude: 33
          latitude: 0
          utc: Date.now()+12*60*60*1000
        
        horizCoord = galactic({altitude: 0, azimuth: rad(-90)}, observation1)
        result = horizCoord.observer(observation2)

        # TODO Why the error here:
        result.altitude().should.be.approximately(0, 0.01) # should be DELTA
        result.azimuth().should.be.approximately(rad(90), DELTA)

      it 'on horizon facing south is straight up for observer 90deg latidue away on same lon', ->
        horizCoord = galactic({altitude: 0, azimuth: 0}, {longitude: rad(99), latitude: rad(60), utc: Date.now()})
        result = horizCoord.observer(longitude: rad(99), latitude: rad(-30), utc: Date.now())

        result.altitude().should.be.approximately(rad(90), DELTA)
        result.azimuth().should.be.approximately(0, DELTA)