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

    var filePath = path.join( htmlDir, metadata.path ),
        allPatterns = options.patterns,
        completeMessage = "updated",
        htmlCode;

    try {
        if( !fs.existsSync( filePath ) && options.boilerplate ){
            htmlCode = fs.readFileSync( options.boilerplate, options.charset );
            completeMessage = "generated";
        }

        if( !htmlCode ){
            htmlCode = fs.readFileSync( filePath, options.charset );
        }
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
        fs.writeFileSync( filePath, htmlCode, options.charset );
    } catch( e ){
        return e;
    }

    return filePath + " ... " + completeMessage + ".";
}


module.exports = function( grunt ){

    grunt.registerMultiTask( "meta_excel", "Update meta tags according to Excel file.", function(){

        var options = this.options( {
                charset: "utf-8",
                patterns: grunt.file.readJSON( path.join( moduleRootPath, "patterns", "meta_tags.json" ) )
            } ),
            requiredOptions = [ "dataStartingRow", "mapping" ],
            done;

        if( this.flags.generate ){
            requiredOptions.push( "boilerplate" );
        }
        else {
            delete options.boilerplate
        }

        requiredOptions.forEach( function( propety ){
            if( !options[ propety ] ){
                grunt.fail.warn( new Error( "options." + propety + " is required." ) );
            }
        } );

        done = this.async();

        xlsx2json( this.data.xlsx, options )
            .then(
                function( pages ){
                    pages.forEach( function( metadata ){
                        if( _( metadata ).values().without( "" ).isEmpty() ){
                            return;
                        }

                        var result = updateHTML( this.data.htmlDir, metadata, options );

                        if( result instanceof Error ){
                            grunt.log.error( result );
                        }
                        else {
                            grunt.log.ok( result );
                        }
                    }, this );
                    done();
                }.bind( this ),

                function( error ){ grunt.log.error( error ); }
            );
    } );
};
