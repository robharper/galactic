galactic = require '../dist/cjs/galactic'
should = require 'should'

DELTA = 0.00001

radians = (deg) ->
  deg/180*Math.PI

describe 'coord', ->
  describe 'conversion', ->

    describe '#eclipticToEquatorial', ->
      
      it 'should convert plane intersections', ->
        result = galactic.coord.eclipticToEquatorial(longitude: 0, latitude: 0)
        result.rightAscension.should.be.approximately(0, DELTA)
        result.declination.should.be.approximately(0, DELTA)

        result = galactic.coord.eclipticToEquatorial(longitude: radians(180), latitude: 0)
        result.rightAscension.should.be.approximately(radians(180), DELTA)
        result.declination.should.be.approximately(0, DELTA)

      it 'should convert 90,0', ->
        result = galactic.coord.eclipticToEquatorial(longitude: radians(90), latitude: radians(0))
        result.rightAscension.should.be.approximately(radians(90), DELTA)
        result.declination.should.be.approximately(galactic.coord.EARTH.obliquity, DELTA)

      it 'should convert 45,30', ->
        result = galactic.coord.eclipticToEquatorial(longitude: radians(45), latitude: radians(30))
        result.rightAscension.should.be.approximately(radians(30.65515), DELTA)
        result.declination.should.be.approximately(radians(44.61414), DELTA)

    describe '#equatorialToEcliptic', ->
      
      it 'should convert plane intersections', ->
        result = galactic.coord.equatorialToEcliptic(rightAscension: 0, declination: 0)
        result.longitude.should.be.approximately(0, DELTA)
        result.latitude.should.be.approximately(0, DELTA)

        result = galactic.coord.equatorialToEcliptic(rightAscension: radians(180), declination: 0)
        result.longitude.should.be.approximately(radians(180), DELTA)
        result.latitude.should.be.approximately(0, DELTA)

      it 'should convert 90,0', ->
        result = galactic.coord.equatorialToEcliptic(rightAscension: radians(90), declination: radians(0))
        result.longitude.should.be.approximately(radians(90), DELTA)
        result.latitude.should.be.approximately(-galactic.coord.EARTH.obliquity, DELTA)

      it 'should convert to 45,30', ->
        result = galactic.coord.equatorialToEcliptic(rightAscension: radians(30.65515), declination: radians(44.61414))
        result.longitude.should.be.approximately(radians(45), DELTA)
        result.latitude.should.be.approximately(radians(30), DELTA)

