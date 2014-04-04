/*
 * grunt-meta-excel
 * Copyright (c) 2014 daikiueda, @ue_di
 * Licensed under the MIT license.
 * https://github.com/daikiueda/grunt-meta-excel
 */

"use strict";

var fs = require( "fs" ),
    path = require( "path" ),
    _ = require( "lodash" ),
    xlsx2json = require( "xlsx2json" ),
    moduleRootPath = path.resolve( path.dirname( module.filename ), ".." ) + path.sep;


/**
 * @param {String} htmlDir
 * @param {Object} metadata
 * @param {Object} options
 * @returns {String|Error}
 */
function updateHTML( htmlDir, metadata, options ){

    if( !metadata.path ){
        return new Error( "File path is not defined. \n" + JSON.stringify( metadata ) );
    }

    var filePath = metadata.path,
        allPatterns = options.patterns,
        htmlCode;

    try {
        htmlCode = fs.readFileSync( path.join( htmlDir, filePath ), options.charset );
    } catch( e ){
        return e;
    }

    _.forEach( allPatterns, function( patterns, attr ){
        if( typeof metadata[ attr ] === "undefined" ){
            return;
        }

        _.forEach( patterns, function( pattern ){
            var target = pattern[ 0 ],
                replace = pattern[ 1 ];

            htmlCode = htmlCode.replace(
                new RegExp( target, "g" ),
                _.template( replace )( metadata )
            );
        } );
    } );

    try {
        fs.writeFileSync( path.join( htmlDir, filePath ), htmlCode, options.charset );
    } catch( e ){
        return e;
    }

    return filePath + " ... updated";
}


module.exports = function( grunt ){

    grunt.registerMultiTask( 'meta_excel', 'HTMLファイルのtitle, description, keywords, OGPなどの値を、Excelファイルの内容にあわせて更新するGruntプラグイン。', function(){

        var done = this.async(),
            options = this.options( {
                charset: "utf-8",
                patterns: grunt.file.readJSON( path.join( moduleRootPath, "patterns", "meta_tags.json" ) )
            } );

        xlsx2json( this.data.xlsx, options )
            .done( function( pages ){
                pages.forEach( function( metadata ){
                    var result = updateHTML( this.data.htmlDir, metadata, options );

                    if( result instanceof Error ){
                        grunt.log.error( result );
                    }
                    else {
                        grunt.log.ok( result );
                    }
                }, this );
                done();
            }.bind( this ) );
    } );
};
