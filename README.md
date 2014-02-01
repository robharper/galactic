# Galactic

> Celestial coordinate conversions and utilities

## Usage

The following examples use some basic transforms:
```
var rad = function(deg) { return deg/180 * Math.PI; };
var deg = function(rad) { return rad*180 / Math.PI; };
```

Where is alpha centuri in the sky above Toronto right now?
```
// Create coordinate in equatorial coordinate system
var centuri = galactic({latitude: rad(-42.587), longitude: rad(239.488)});

// Observer (Toronto, now)
var observer = {latitude: rad(43.7001100), longitude: rad(-79.4163000), utc: Date.now()};

// Convert to horizontal given observer place/time
var horizontal = centuri.horizontal( observer );

// Where is it?
console.log('Altitude: ' + deg(horizontal.altitude()) + ', Azimuth: ' + deg(horizontal.azimuth()));
```

Where is the sun in the skies of Toronto?
```
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

### Building

    npm install
    grunt

  AMD and CJS compatible formats will be created in `dist/`

### To Do
 
  - Document API
  - Example usage
  - Clean up coordinate transforms API supporting multiple coord formats
  - Extract celestial body definitions to generalize
  - Add handy additional functions, e.g. sun and moon positions given date
  - NPM prepublish compile step
