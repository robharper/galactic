galactic = require '../dist/cjs/galactic'
should = require 'should'

DELTA = 0.00001

radians = (deg) ->
  deg/180*Math.PI

describe 'coord', ->
  describe 'conversion', ->

    describe '#equatorialToEcliptic', ->
      
      it 'should accept hour angle, local sidereal of observer', ->
        result = galactic.coord.equatorialToEcliptic({hourAngle: radians(-30), declination: radians(30)}, localSidereal: radians(30))
        result.longitude.should.be.approximately(radians(63.97945), DELTA)
        result.latitude.should.be.approximately(radians(9.23059), DELTA)


      it 'should accept hour angle, time and longitude of observer', ->
        # The following time/longitude yields local sidereal of 2h
        observer = 
          utc: 1385088897000
          longitude: radians(-75)
        result = galactic.coord.equatorialToEcliptic({hourAngle: radians(-30), declination: radians(30)}, observer)
        result.longitude.should.be.approximately(radians(63.97945), DELTA)
        result.latitude.should.be.approximately(radians(9.23059), DELTA)

