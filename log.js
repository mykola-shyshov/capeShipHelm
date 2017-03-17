class Logger {
    constructor( name ) {
        this.name = name;
    }

    static create( name ) {
        return new Logger( name );
    }

    info() {
        let prefix = new Date() + ' ' + this.name;
        let argumentsArray = Array.from(arguments);
        argumentsArray.unshift(prefix);
        console.info.apply( this, argumentsArray );
    }
}

module.exports = Logger;