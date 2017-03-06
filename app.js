const Express = require( 'express' );
const config = require( './config.js' );
const Log = require( './log.js' );
const path = require( 'path' );

const logger = Log.create( "app.js" );
const express = new Express();
// const router = Express.Router();


// need json validation
logger.info( '-|- cape ship helm -|-' );
logger.info( 'Registering routes' );
config.shipSpec.routes.forEach( ( route ) => {
    logger.info( 'Registering: ' + route.path );

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
        express.get( route.path, ( req, res ) => {
            res.sendFile( filePath );
        } );
    }
} );

const server = express.listen( 3000, function () {
    const host = server.address().address;
    const port = server.address().port;
    logger.info( 'Application started' );
    logger.info( 'Listening %s:%s', host, port );
} );
