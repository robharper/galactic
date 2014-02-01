module.exports = (grunt) ->
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  grunt.initConfig
    clean:
      temp: '.tmp'
      dist: 'dist'

    # ES6 Module transpile
    transpile:
      # Creates CommonJS modules
      cjs:
        type: 'cjs'
        files: [{
          expand: true
          cwd: 'lib/'
          src: ['**/*.coffee']
          dest: '.tmp/cjs'
        }]
      # Creates AMD modules
      amd:
        type: 'amd'
        files: [{
          expand: true
          cwd: 'lib/'
          src: ['**/*.coffee']
          dest: '.tmp/amd'
        }]
    
    browserify:
      dist:
        files:
          'dist/galactic.js': ['dist/cjs/galactic.js']
        options:
          standalone: 'galactic'

    # Distribution is plain old JS, compile coffeescript
    coffee: 
      cjs:
        options:
          bare: true
        files: [{
          expand: true
          cwd: '.tmp'
          src: 'cjs/**/*.coffee'
          dest: 'dist'
          ext: '.js'
        }]
      amd:
        files: [{
          expand: true
          cwd: '.tmp'
          src: 'amd/**/*.coffee'
          dest: 'dist'
          ext: '.js'
        }]

  # Build distribution:
  grunt.registerTask 'default', [
    'clean'
    'transpile'
    'coffee'
    'browserify'
  ]
