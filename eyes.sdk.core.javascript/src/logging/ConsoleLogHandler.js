'use strict';

const GeneralUtils = require('../GeneralUtils');
const LogHandler = require('./LogHandler');

/**
 * Write log massages to the browser/node console
 */
class ConsoleLogHandler extends LogHandler {

    /**
     * @param {Boolean} isVerbose Whether to handle or ignore verbose log messages.
     **/
    constructor(isVerbose) {
        super();

        this.setIsVerbose(isVerbose);
    }

    open() {}

    close() {}

    //noinspection JSUnusedGlobalSymbols
    /**
     * Handle a message to be logged.
     *
     * @param {Boolean} verbose - is the message verbose
     * @param {String} message
     */
    onMessage(verbose, message) {
        if (!verbose || this._isVerbose) {
            console.log(`${GeneralUtils.getIso8601Data()} - Eyes: ${message}`);
        }
    }
}

module.exports = ConsoleLogHandler;
