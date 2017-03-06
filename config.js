const spec = require( './spec/spec.json' );
const path = require( 'path' );

module.exports = {
    shipAssetsDir: path.join( __dirname, './spec/assets' ),
    shipSpec: spec,
    shipCabinAddress: 'http://localhost:9090'
};
