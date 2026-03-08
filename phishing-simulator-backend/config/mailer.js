const nodemailer = require('nodemailer');

let transporter;
let transporterReady = false;

// Configure Nodemailer with Ethereal Email (Safe for testing)
// nodemailer v8 uses Promise-based API — callback form was removed
nodemailer.createTestAccount()
    .then((account) => {
        transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });
        transporterReady = true;
        console.log('Nodemailer test account ready. Check https://ethereal.email/login');
        console.log(`Credentials: user: ${account.user}, pass: ${account.pass}`);
    })
    .catch((err) => {
        console.error('Failed to create a testing account. ' + err.message);
    });

const getTransporter = () => transporter;

module.exports = { getTransporter, nodemailer };
