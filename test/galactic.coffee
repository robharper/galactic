galactic = require '../dist/cjs/main'
should = require 'should'

DELTA = 0.00001

radians = (deg) ->
  deg/180*Math.PI

describe 'galactic', ->
  describe 'ecliptic', ->
      
    it 'should be convertable to equatorial coordinates', ->
      eclipticCoord = galactic(longitude: radians(45), latitude: radians(30))
      result = eclipticCoord.equatorial()

      result.rightAscension().should.be.approximately(radians(30.65515), DELTA)
      result.declination().should.be.approximately(radians(44.61414), DELTA)

    it 'should be invertible', ->
      eclipticCoord = galactic(longitude: radians(45), latitude: radians(30))
      result = eclipticCoord.equatorial().ecliptic()

      result.longitude().should.be.approximately(radians(45), DELTA)
      result.latitude().should.be.approximately(radians(30), DELTA)

    it 'should be independent of observer', ->
      eclipticCoord = galactic(longitude: radians(123), latitude: radians(56))
      result = eclipticCoord.observer(longitude: 33, latitude: 12)

      result.longitude().should.equal( eclipticCoord.longitude() )
      result.latitude().should.equal( eclipticCoord.latitude() )

