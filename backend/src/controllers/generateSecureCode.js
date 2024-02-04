const crypto = require('crypto');

const generateSecureCode = (length) => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(length, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                const code = buffer.toString('hex').substring(0, length);
                resolve(code);
            }
        });
    });
};

module.exports = generateSecureCode;