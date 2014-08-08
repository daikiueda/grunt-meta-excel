/*
 * grunt-meta-excel
 * Copyright (c) 2014 daikiueda, @ue_di
 * Licensed under the MIT license.
 * https://github.com/daikiueda/grunt-meta-excel
 */

"use strict";

var fs = require( "fs" ),
    path = require( "path" ),
    mkdirp = require( "mkdirp" ),
    
    _ = require( "lodash" ),
    xlsx2json = require( "xlsx2json" ),
    iconv = require( "iconv-lite" ),
    moduleRootPath = path.resolve( path.dirname( module.filename ), ".." );


/**
 * @param {String} htmlDir
 * @param {Object} metadata
 * @param {Object} options
 *   @param {Object} options.patterns
 *   @param {String} options.charset
 *   @param {String} options.boilerplate
 * @returns {String|Error}
 */
function updateHTML( htmlDir, metadata, options ){
    
    options = options || {};

    if( !metadata.path ){
        return new Error( "File path is not defined. \n" + JSON.stringify( metadata ) );
    }

    var filePath = path.join( htmlDir, metadata.path ),
        allPatterns = options.patterns,
        charset = options.charset || "utf8",
        boilerplate = options.boilerplate,
        completeMessage = "updated",
        htmlCode;

    try {
        if( !fs.existsSync( filePath ) && boilerplate ){
            htmlCode = iconv.decode( fs.readFileSync( boilerplate), charset );
            completeMessage = "generated";
        }

        if( !htmlCode ){
            htmlCode = iconv.decode( fs.readFileSync( filePath ), charset );
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
        if( !fs.existsSync( path.dirname( filePath ) ) ){
            mkdirp.sync( path.dirname( filePath ) );
        }

        fs.writeFileSync( filePath, iconv.encode( htmlCode, charset ) );
    } catch( e ){
        return e;
    }

    return filePath + " ... " + completeMessage + ".";
}


module.exports = function( grunt ){

    grunt.registerMultiTask( "meta_excel", "Update meta tags according to Excel file.", function(){

        var options = this.options( { charset: "utf-8" } ),
            requiredOptions = [ "dataStartingRow", "mapping" ],
            patternsJsonPath,
            done;

        if( this.flags.generate ){
            requiredOptions.push( "boilerplate" );
        }
        else {
            delete options.boilerplate;
        }
        
        requiredOptions.forEach( function( propety ){
            if( !options[ propety ] ){
                grunt.fail.warn( new Error( "options." + propety + " is required." ) );
            }
        } );

        options.patterns = grunt.file.readJSON(
            options.patternsJsonPath ?
                path.join( process.cwd(), options.patternsJsonPath ):
                path.join( moduleRootPath, "patterns", "meta_tags.json" )
        );

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
