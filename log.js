class Logger {
    constructor( name ) {
        this.name = name;
    }

    static create( name ) {
        return new Logger( name );
    }

    info() {
        console.info.apply( this, arguments );
    }
}

module.exports = Logger;