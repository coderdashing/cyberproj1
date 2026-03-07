const nodemailer = require('nodemailer');

let transporter;

// Configure Nodemailer with Ethereal Email (Safe for testing)
nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return;
    }
    transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });
    console.log('Nodemailer test account ready. Check https://ethereal.email/login');
    console.log(`Credentials: user: ${account.user}, pass: ${account.pass}`);
});

const getTransporter = () => transporter;

module.exports = { getTransporter, nodemailer };
