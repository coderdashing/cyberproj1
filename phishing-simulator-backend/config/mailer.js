const nodemailer = require('nodemailer');

let transporter;
let transporterReady = false;

// Configure Nodemailer with REAL SMTP (e.g. Gmail)
try {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    transporterReady = true;
    console.log(`Nodemailer is connected to Real SMTP (${process.env.SMTP_USER})`);
} catch (err) {
    console.error('Failed to configure SMTP account. Please check your .env file.', err.message);
}

const getTransporter = () => transporter;

module.exports = { getTransporter, nodemailer };
