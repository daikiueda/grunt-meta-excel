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


function updateHTML( htmlDir, metadata, options, grunt ){

    if( !metadata.uri ){
        return;
    }

    var allPatterns = options.patterns,
        htmlCode = fs.readFileSync( path.normalize( htmlDir + path.sep + metadata.uri ), options.charset );

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

    fs.writeFileSync( path.normalize( htmlDir + path.sep + metadata.uri ), htmlCode, options.charset );

    ( grunt ? grunt.log.writeln: console.log )( metadata.uri + " ... updated" );
}


module.exports = function( grunt ){

    grunt.registerMultiTask( 'meta_excel', 'HTMLファイルのtitle, description, keywords, OGPなどの値を、Excelファイルの内容にのっとって更新するGruntプラグイン。', function(){

        var done = this.async(),
            options = this.options( {
                charset: "utf-8",
                patterns: grunt.file.readJSON( path.join( moduleRootPath, "patterns", "meta_tags-0.0.0.json" ) )
            } );

        xlsx2json( this.data.xlsx, options )
            .done( function( pages ){
                pages.forEach( function( metadata ){
                    updateHTML( this.data.htmlDir, metadata, options, grunt );
                }, this );
                done();
            }.bind( this ) );
    } );
};
