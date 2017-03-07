const Express = require( 'express' );
const config = require( './config.js' );
const Log = require( './log.js' );
const path = require( 'path' );
const request = require('superagent');

const logger = Log.create( "app.js" );
const express = new Express();

// need json validation
logger.info( '-|- cape ship helm -|-' );
logger.info( 'Registering routes' );
config.shipSpec.routes.forEach( ( route ) => {
    if ( route.resource.assets ) {
        route.resource.assets.forEach( ( file ) => {
            const url = route.path + '/' + file;
            const filePath = path.join( config.shipAssetsDir, file );

            logger.info( 'Registering: asset route ', url, '->', filePath );
            express.get( url, ( req, res ) => {
                res.sendFile( filePath );
            } );
        } );
    }

    if ( route.resource.asset ) {
        const filePath = path.join( config.shipAssetsDir, route.resource.asset );
        logger.info( 'Registering: asset ', route.path, '->', filePath );
        express.get( route.path, ( req, res ) => {
            res.sendFile( filePath );
        } );
    }

    if ( route.resource.api ) {

        // goods endpoint
        let path = route.path + '/v1/goods';
        let remotePath = config.shipCabinAddress + '/v1/goods/';
        logger.info( 'Registering: api ', path, '->', remotePath );
        express.get( path, ( req, eRes ) => {
            request.get( remotePath ).end(
                ( err, res ) => {
                    eRes.setHeader('Content-Type', 'application/json');
                    eRes.send(
                        res.text
                    );
                }
            );
        } );

    }
} );

const server = express.listen( 3000, function () {
    const host = server.address().address;
    const port = server.address().port;
    logger.info( 'Application started' );
    logger.info( 'Listening %s:%s', host, port );
} );
