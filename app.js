const Express = require('express');
const config = require('./config.js');
const Log = require('./log.js');
const path = require('path');
const request = require('superagent');
const bodyParser = require('body-parser')

const logger = Log.create("app.js");
const express = new Express();

express.use( bodyParser.json() );
// need json validation
logger.info('-|- cape ship helm -|-');
logger.info('Registering routes');

config.shipSpec.routes.forEach((route) => {

    if (route.resource.assets) {
        route.resource.assets.forEach((file) => {
            const url = route.path + '/' + file;
            const filePath = path.join(config.shipAssetsDir, file);

            logger.info('Registering: asset route ', url, '->', filePath);
            express.get(url, (req, res) => {
                res.sendFile(filePath);
            });
        });
    }

    if (route.resource.asset) {
        const filePath = path.join(config.shipAssetsDir, route.resource.asset);
        logger.info('Registering: asset ', route.path, '->', filePath);
        express.get(route.path, (req, res) => {
            res.sendFile(filePath);
        });
    }

    if (route.resource.api) {
        registerProxy(
            express, {
                path: route.path + '/v1/goods/',
                remotePath: config.shipCabinAddress + '/v1/goods/',
                method: 'get'
            }
        );

        registerProxy(
            express, {
                path: route.path + '/v1/orders/',
                remotePath: config.shipCabinAddress + '/v1/orders/',
                method: 'post'
            }
        );

        // captain
        registerProxy(
            express, {
                path: route.path + '/v1/captain/goods/',
                remotePath: config.shipCabinAddress + '/v1/captain/goods/',
                method: 'get'
            }
        );

        registerProxy(
            express, {
                path: route.path + '/v1/captain/goods/',
                remotePath: config.shipCabinAddress + '/v1/captain/goods/',
                method: 'put'
            }
        );

        registerProxy(
            express, {
                path: route.path + '/v1/captain/orders/',
                remotePath: config.shipCabinAddress + '/v1/captain/orders/',
                method: 'get'
            }
        );

        registerProxy(
            express, {
                path: route.path + '/v1/captain/orders/',
                remotePath: config.shipCabinAddress + '/v1/captain/orders/',
                method: 'put'
            }
        );
    }
});

function registerProxy(express, options) {
    let path = options.path;
    let remotePath = options.remotePath;
    let method = options.method;

    logger.info('Registering: api ', method, path, '->', remotePath);

    express.get(path, (eReq, eRes) => {
        let proxyRequet;

        switch (method) {
            case 'get':
                proxyRequet = request.get(remotePath);
                break;
            case 'post':
                proxyRequet = request.post(remotePath).data(eReq.body);
                break;
            default:
                throw new Error('Method is not supported ' + method);
        }

        proxyRequet
            .set('Authorization', eReq.headers['authorization'] || '')
            .end((err, res) => {
                    eRes.setHeader('Content-Type', 'application/json');

                    eRes.send(
                        res.text
                    );
            });
    });
}

const server = express.listen(3000, function () {
    const host = server.address().address;
    const port = server.address().port;
    logger.info('Application started');
    logger.info('Listening %s:%s', host, port);
});
