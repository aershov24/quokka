var cfg 	= 	require('../config.js')
var winston = 	require('winston');
				require('winston-loggly');

winston.emitErrs = true;
winston.cli();

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: cfg.log.file,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

logger.add(winston.transports.Loggly, cfg.loggly);

logger.cli();
logger.pdata = function(str, data){
    logger.debug(str);
    return logger.data(data);
};

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};