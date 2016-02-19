module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    jshint: {
      files: [
        'server/**/*.js',
        'public/client/**/*.js'
      ],
      options: {
        jshintrc: '_.jshintrc',
        ignores: [
          'public/client/assets/libs/**/*.js',
          'public/client/assets/js/**/*.js'
        ],
        force: true
      }
    },

    watch: {
      scripts: {
        files: [
          'server/**/*.js',
          'public/client/**/*'
        ],
        tasks: [
          'build', 
          'test'
        ]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('build', ['jshint']);
  grunt.registerTask('test', ['mochaTest']);

  grunt.registerTask('default', ['watch']);



}
