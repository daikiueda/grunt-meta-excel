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
    xlsx2json = require( "xlsx2json" );

var Options = function( options ){
    this.mapping = this._mapping();
    this.patterns = this._patterns();
};
Options.prototype = {
    charset: "utf-8",

    dataStartingRow: 8,

    _mapping: function(){ return {
        uri: "A",
        title: "B",
        title_all: "D",
        description: "E",
        keywords: "F",
        url: "G",
        thumbnail: "H",
        canonical: "I"
    } },

    _patterns: function(){ return {
        title_all: {
            '<title>.*</title>': '<title><%= title_all %></title>',
            '<meta property="og:title"[^>]* content="[^"]*<\\$mt:[^$]+\\$>[^"]*"[^>]*>': '<meta property="og:title" content="###">',
            '<meta [^>]*property="og:title"[^>]*>': '<meta property="og:title" content="<%= title_all %>">'
        },

        description: {
            '<meta [^>]*name="description"[^>]*>': '<meta name="description" content="<%= description %>">',
            '<meta [^>]*property="og:description"[^>]*>': '<meta property="og:description" content="<%= description %>">'
        },

        keywords: {
            '<meta [^>]*name="keywords"[^>]*>': '<meta name="keywords" content="<%= keywords %>">'
        },

        url: {
            '<meta [^>]*property="og:url"[^>]*>': '<meta property="og:url" content="<%= url.replace( "index.html", "" ) %>">'
        },

        thumbnail: {
            '<meta [^>]*property="og:image"[^>]*>': '<meta property="og:image" content="<%= thumbnail %>">'
        },

        canonical: {
            '<link [^>]*rel="canonical"[^>]*>': '<link rel="canonical" href="<%= canonical.replace( "index.html", "" ) %>">'
        }
    } },

    before: null
};

function updateHTML( htmlDir, metadata, options, grunt ){

    if( !metadata.uri ){
        return;
    }

    var patterns = options.patterns,
        htmlCode = fs.readFileSync( path.normalize( htmlDir + path.sep + metadata.uri ), options.charset );

    _.forEach( patterns, function( patternSet, attr ){
        if( typeof metadata[ attr ] === "undefined" ){
            return;
        }

        _.forEach( patternSet, function( replace, pattern ){
            htmlCode = htmlCode.replace(
                new RegExp( pattern, "g" ),
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
//            options = this.options();
            options = new Options();

        xlsx2json( this.data.xlsx, options )
            .done( function( pages ){
                pages.forEach( function( metadata ){
                    updateHTML( this.data.htmlDir, metadata, options, grunt );
                }, this );
                done();
            }.bind( this ) );
    } );
};
