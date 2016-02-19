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

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'public/client/assets/css/main.css': 'public/client/assets/css/main.scss'
        }
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
      },
      sass: {
        files: [
          'public/client/assets/css/**/*.scss'
        ],
        tasks: [
          'sass'
        ]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('sassy', ['sass']);

  grunt.registerTask('build', ['jshint', 'sass']);
  grunt.registerTask('test', ['mochaTest']);

  grunt.registerTask('default', ['watch']);



}
