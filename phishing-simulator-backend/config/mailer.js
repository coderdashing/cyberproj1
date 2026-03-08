const nodemailer = require('nodemailer');
const dns = require('dns');

// Force IPv4 DNS resolution (Fixes ENETUNREACH IPv6 errors on Render)
dns.setDefaultResultOrder('ipv4first');

let transporter;
let transporterReady = false;

// Configure Nodemailer with REAL SMTP (e.g. Gmail)
try {
    transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
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
