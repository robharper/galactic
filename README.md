# Galactic

> Celestial coordinate conversions and utilities

## Installation

```
bower install galactic
```

or 

```
npm install galactic
```

## Usage

The following examples use some basic transforms:
```javascript
var rad = function(deg) { return deg/180 * Math.PI; };
var deg = function(rad) { return rad*180 / Math.PI; };
```

**Equatorial to Horizontal: Where is alpha centauri in the sky above Toronto right now?**
```javascript
// Create coordinate in equatorial coordinate system
var centauri = galactic({rightAscension: rad(219.9), declination: rad(-60.8339)});

// Observer (Toronto, now)
var observer = {latitude: rad(43.7001100), longitude: rad(-79.4163000), utc: Date.now()};

// Convert to horizontal given observer place/time
var horizontal = centauri.horizontal( observer );

// Where is it?
console.log('Altitude: ' + deg(horizontal.altitude()) + ', Azimuth: ' + deg(horizontal.azimuth()));
```

**Ecliptic to Horizontal: Where is the sun right now in the skies of Toronto?**
```javascript
// Create coordinate in equatorial coordinate system
// Calculate sun's mean longitude (approx)
var n = galactic.dates.unixDateToJulian(Date.now()) - galactic.dates.J2000
var meanLongitude = 280.46 + 0.9856474*n
var sun = galactic({longitude: rad(meanLongitude), latitude: 0});

// Observer (Toronto, now)
var observer = {latitude: rad(43.7001100), longitude: rad(-79.4163000), utc: Date.now()};

// Convert to horizontal given observer place/time
var horizontal = sun.horizontal( observer );

// Where is it?
console.log('Sun - Altitude: ' + deg(horizontal.altitude()) + ', Azimuth: ' + deg(horizontal.azimuth()));
```

**If a star is directly overhead in Toronto, where in the sky is it in Portland?**
```javascript
// Observer 1 (Toronto)
var observer1 = {latitude: rad(43.7001100), longitude: rad(-79.4163000), utc: Date.now()};
// Observer 2 (Portland)
var observer2 = {latitude: rad(45.5200), longitude: rad(-122.6819), utc: Date.now()};

// Up in Toronto
var up = galactic({azimuth: rad(0), altitude: rad(90)}, observer1);

// Convert to observer in Portland
var portlandSky = up.observer( observer2 );

// Where is it?
console.log('In Portland - Altitude: ' + deg(portlandSky.altitude()) + ', Azimuth: ' + deg(portlandSky.azimuth()));
```


### Notes

 - All angle values must be in radians
 - Azimuth is referred to the south point of the horizon, the common astronomical reckoning
 - The obliquity of the ecliptic is fixed at 23.439 degrees which is roughly accurate for Earth-based calculations at times near J2000. An alternate value of the obliquity can be given via `obliquity: ###` as part of the coordinate hash during instantiation.
 - The equations don't account for atmospheric refraction, diurnal parallax, or other complicating factors

## Building

    npm install
    grunt

  AMD, CJS, and standalone formats will be created in `dist/`

## To Do
 
  - Document API
  - Observer accessor
  - Mutator API
  - Complete unit tests
  - More Example usage
  - Extract celestial body definitions to generalize
  - Add handy additional functions, e.g. sun and moon positions given date
  - NPM prepublish compile step
