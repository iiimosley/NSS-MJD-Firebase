module.exports = function (grunt) {
    grunt.initConfig({
        browserify: {
            files: {
                src: "./javascripts/main.js",
                dest: "./dist/app.js"
            },
            options: {
                transform: ["hbsfy"]
            }
        },
        jshint: {
            options: {
                predef: ["document", "console", "alert", "$"],
                esnext: true,
                globalstrict: true,
                globals: {},
                browserify: true
            },
            files: ["./javascripts/**/*.js"]
        },
        watch: {
            options: {
                reload: true
            },
            javascripts: {
                files: ["./javascripts/**/*.js"],
                tasks: ["jshint", "browserify"]
            },
            hbs: {
                files: ["./templates/**/*.hbs"],
                tasks: ["browserify"]
            }
        }
    });

    require("matchdep")
        .filter("grunt-*")
        .forEach(grunt.loadNpmTasks);

    grunt.registerTask("default", ["jshint", "browserify", "watch"]);
};