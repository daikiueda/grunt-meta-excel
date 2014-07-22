"use strict";

var TEMP_DIR = "./.tmp",
    
    expect = require( "chai" ).expect,
    
    Q = require( "q" ),
    path = require( "path" ),
    fs = require( "fs" ),
    rimraf = require( "rimraf" ),
    cpy = require( "cpy" );


describe( "grunt-meta-excel", function(){
    
    before( function( done ){
        prepareTestFiles( function(){
            done();
        } )
    } );
    
//    after( function(){
//        rimraf.sync( TEMP_DIR );
//    } );
    
    it( "test", function( done ){
        setInterval( done, 1000 );
    } );
} );


function prepareTestFiles( done ){
    if( fs.existsSync( TEMP_DIR ) ){
        rimraf.sync( TEMP_DIR );
    }

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
            .then( function(){ done(); } );
    } );
}
