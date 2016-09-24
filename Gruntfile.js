


module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        "jsbeautifier": {
            "default": {
                src: ["src/**/*.js"],
                options: {
                    js: {
                        preserveNewlines: false,
                maxPreserveNewlines: 1 
                    }
                }
               
            }
        }
    });
    grunt.loadNpmTasks("grunt-jsbeautifier");
};