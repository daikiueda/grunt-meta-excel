/*
 * grunt-meta-excel
 * Copyright (c) 2014 daikiueda, @ue_di
 * Licensed under the MIT license.
 * https://github.com/daikiueda/grunt-meta-excel
 */

"use strict";

module.exports = function( grunt ){

    grunt.initConfig( {
        meta_excel: {
            options: {
                dataStartingRow: 7,
                mapping: {
                    path: "E",
                    title: "F",
                    title_all: "G",
                    description: "I",
                    keywords: "K",
                    url: "M",
                    thumbnail: "N"
                }
            },
            sample_site: {
                xlsx: "sample/sitemap.xlsm",
                htmlDir: "sample/htdocs",
                options: {
                    boilerplate: "sample/htdocs/__boilerplate.html"
                }
            },
            
            test_utf8_update: {
                xlsx: "sample/sitemap.xlsm",
                htmlDir: ".tmp/htdocs_update",
                options: {
                    boilerplate: ".tmp/htdocs_update/__boilerplate.html"
                }
            }
        },

        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: "spec"
                },
                src: [ "test/**/*.js" ]
            }
        }
    } );

    grunt.loadTasks( "tasks" );
    grunt.registerTask( "default", "meta_excel:sample_site" );

    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    grunt.loadNpmTasks( "grunt-mocha-test" );
    grunt.registerTask( "test", [ "jshint", "mochaTest" ] );
};
