"use strict";

var TEMP_DIR = "./.tmp",
    
    expect = require( "chai" ).expect,
    
    Q = require( "q" ),
    path = require( "path" ),
    fs = require( "fs" );


describe( "grunt-meta-excel", function(){
    
    before( function( done ){
        prepareTestFiles().then( function(){ done(); } );
    } );
    
    after( function( done ){
        removeTestFiles().then( function(){ done(); } );
    } );
    
    it( "test", function( done ){
        setInterval( done, 100 );
    } );
} );


function prepareTestFiles(){
    var deferred = Q.defer(),
        cpy = require( "cpy" );

    removeTestFiles()
        .then( function(){
            fs.mkdir( TEMP_DIR, function( err ){

                Q.all(
                    ( function(){
                        var deferred = Q.defer();
                        cpy( ["**/*"], path.resolve( TEMP_DIR, "htdocs_replace" ), { cwd: "./sample/htdocs" }, function( err ){
                            deferred.resolve( err );
                        } );
                        return deferred.promise;
                    } )(),

                    ( function(){
                        var deferred = Q.defer();
                        cpy( ["__boilerplate.html"], path.resolve( TEMP_DIR, "htdocs_generate" ), { cwd: "./sample/htdocs" }, function( err ){
                            deferred.resolve( err );
                        } );
                        return deferred.promise;
                    } )()
                )
                    .then( function(){ deferred.resolve( true ); } );
        } );
    } );
    
    return deferred.promise;
}

function removeTestFiles(){
    var deferred = Q.defer();

        if( fs.existsSync( TEMP_DIR ) ){
            require( "rimraf" )( TEMP_DIR, function(){
            deferred.resolve( true );
        } );
    }
    else {
        deferred.resolve( true );
    }

    return deferred.promise;
}

