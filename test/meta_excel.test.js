"use strict";

var TEMP_DIR = "./.tmp",

    exec = require( "child_process" ).exec,
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


    describe( "utf8 (default)", function(){
        
        describe( "Update meta tags.", function(){

            it( "内容が更新される。", function( done ){
                exec( "grunt meta_excel:test_utf8_update", function( err ){
                    
                    done();
                } );
            } );
        } );

        describe( "Generate html files.", function(){

            it( "HTMLファイルが生成される。" );
            
            it( "内容がxlsxどおりである。" );
        } );
    } );


    describe( "shift_jis", function(){

        describe( "Update meta tags.", function(){

            it( "内容が更新される。" );
        } );

        describe( "Generate html files.", function(){

            it( "HTMLファイルが生成される。" );

            it( "内容がxlsxどおりである。" );

        } );
    } );

    describe( "Implementation of test cases.", function(){
        it( "Progress", function(){
            throw new Error( "is in the process" );
        } );
    } );
} );


function prepareTestFiles(){
    var deferred = Q.defer(),
        shell = require( "shelljs" );

    removeTestFiles()
        .then( function(){
            fs.mkdir( TEMP_DIR, function( err ){
                if( err ){
                    deferred.reject( err );
                    return;
                }

                shell.cp(
                    "-r",
                    path.resolve( "./sample/htdocs/*" ),
                    path.resolve( TEMP_DIR, "htdocs_update" )
                );

                shell.cp(
                    "-r",
                    path.resolve( "./sample/htdocs/__boilerplate.html" ),
                    path.resolve( TEMP_DIR, "htdocs_generate" )
                );
                
                deferred.resolve( true );
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

