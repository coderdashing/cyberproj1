const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.resolve(__dirname, 'phishing.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create table
        db.run(`CREATE TABLE IF NOT EXISTS campaigns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            template TEXT NOT NULL,
            target_email TEXT NOT NULL,
            status TEXT DEFAULT 'sent',
            clicked BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error("Error creating table", err.message);
            } else {
                console.log("Campaigns table ready.");
            }
        });
    }
});

// Configure Nodemailer with Ethereal Email (Safe for testing)
let transporter;
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


// API ROUTES

// Get all campaigns
app.get('/api/campaigns', (req, res) => {
    db.all("SELECT * FROM campaigns ORDER BY created_at DESC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

// Create and send new campaign(s) (Supports multiple emails)
app.post('/api/campaigns', (req, res) => {
    const { name, template, target_email } = req.body;
    if (!name || !template || !target_email) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    // Process multiple comma-separated emails
    const emails = target_email.split(',').map(e => e.trim()).filter(e => e !== '');
    
    if (emails.length === 0) {
        return res.status(400).json({ error: "No valid emails provided." });
    }

    const insertedCampaigns = [];
    let processedCount = 0;

    emails.forEach(email => {
        db.run(
            'INSERT INTO campaigns (name, template, target_email) VALUES (?, ?, ?)',
            [name, template, email],
            function (err) {
                processedCount++;
                
                if (err) {
                    console.error("Database error for email:", email, err.message);
                } else {
                    const campaignId = this.lastID;
                    insertedCampaigns.push({ id: campaignId, name, template, target_email: email, status: 'sent' });

                    // Phase 2: Link points to the Frontend Fake Login Portal instead of the backend directly
                    // Assuming default Vite port is 5173
                    const portalLink = `http://localhost:5173/portal/${campaignId}/${encodeURIComponent(email)}`;

                    // Send Email Simulation
                    let subject = 'Important Account Update';
                    let textTemplate = `Please verify your recent login attempts here: ${portalLink}`;
                    let htmlTemplate = `<p>Please <a href="${portalLink}">verify your recent login attempts here</a>.</p>`;

                    if (template === 'password_reset') {
                         subject = 'URGENT: Password Reset Required';
                         textTemplate = `Your password will expire in 24 hours. Reset it here immediately: ${portalLink}`;
                         htmlTemplate = `<h2>Action Required</h2><p>Your password will expire in 24 hours. <a href="${portalLink}">Reset it here</a> immediately.</p>`;
                    } else if (template === 'gift_card') {
                         subject = 'You have a new Amazon Gift Card!';
                         textTemplate = `A colleague sent you a $50 gift card! Claim it here: ${portalLink}`;
                         htmlTemplate = `<h2>Gift Card Reward</h2><p>A colleague sent you a $50 gift card! <a href="${portalLink}">Claim it here</a>.</p>`;
                    }

                    const mailOptions = {
                        from: '"IT Dept" <it-alerts@simulator.local>',
                        to: email,
                        subject: subject,
                        text: textTemplate,
                        html: htmlTemplate
                    };

                    if(transporter) {
                         transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.error('Error sending mail:', error);
                            } else {
                                console.log('Message sent: %s', info.messageId);
                                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                            }
                         });
                    }
                }

                // Send response once all emails are processed
                if (processedCount === emails.length) {
                    res.json({
                        message: "success",
                        data: insertedCampaigns // Array of all created rows
                    });
                }
            }
        );
    });
});

// Phase 2: The "Malicious" Click Endpoint is now a POST hit by the React Portal
app.post('/api/click', (req, res) => {
    const { campaignId, email, password } = req.body; // Password intentionally ignored for safety

    // Log the click in the database
    db.run(
        'UPDATE campaigns SET clicked = 1, status = "clicked" WHERE id = ? AND target_email = ?',
        [campaignId, email],
        function(err) {
            if (err) {
                 console.error("Error updating click status:", err.message);
                 return res.status(500).json({ error: "Internal Server Error" });
            }
            
            console.log(`User ${email} submitted credentials on fake portal for campaign ${campaignId}!`);

            res.json({ message: "Phish logged successfully." });
        }
    );
});

// Start Server
app.listen(PORT, () => {
    console.log(`Phishing Simulator Backend running on port ${PORT}`);
});
