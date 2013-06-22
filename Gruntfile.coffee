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
      # TODO Browser global

    # Distribution is plain old JS, compile coffeescript
    coffee: 
      dist:
        files: [{
          expand: true
          cwd: '.tmp'
          src: '**/*.coffee'
          dest: 'dist'
          ext: '.js'
        }]

  # Build distribution:
  grunt.registerTask 'default', [
    'clean'
    'transpile'
    'coffee'
  ]
