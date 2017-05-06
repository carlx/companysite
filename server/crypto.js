module.exports = {
    decrypt: function(text){
        const crypto = require("crypto");
        const config = require('./config.json');
        const algorithm = 'aes-256-ctr'
        const password = config.password2
        var decipher = crypto.createDecipher(algorithm,password)
        var dec = decipher.update(text,'hex','utf8')
        dec += decipher.final('utf8');
        return dec;
    }
}

