const db = require('../config/db');
const { getTransporter, nodemailer } = require('../config/mailer');

const getAllCampaigns = (req, res) => {
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
};

const createCampaigns = (req, res) => {
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
    const transporter = getTransporter();

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

                    const portalLink = `http://localhost:5173/portal/${campaignId}/${encodeURIComponent(email)}`;

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

                if (processedCount === emails.length) {
                    res.json({
                        message: "success",
                        data: insertedCampaigns
                    });
                }
            }
        );
    });
};

const registerClick = (req, res) => {
    const { campaignId, email } = req.body;

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
};

// NEW API FUNCTION: Clears history by wiping table
const clearCampaigns = (req, res) => {
    db.run('DELETE FROM campaigns', [], function(err) {
        if (err) {
            console.error("Error clearing campaigns:", err.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        
        // Reset the auto-increment counter
        db.run('DELETE FROM sqlite_sequence WHERE name="campaigns"', [], (errSeq) => {
            if (errSeq) console.error("Error resetting SQLite sequence", errSeq.message);
            res.json({ message: "success" });
        });
    });
};

module.exports = {
    getAllCampaigns,
    createCampaigns,
    registerClick,
    clearCampaigns
};
