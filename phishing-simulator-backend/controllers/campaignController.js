const db = require('../config/db');
const { getTransporter, nodemailer } = require('../config/mailer');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


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

const createCampaigns = async (req, res) => {
    const { name, prompt, target_email } = req.body;
    if (!name || !prompt || !target_email) {
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

    try {
        // Step 1: Use Gemini to generate a highly convincing Phishing Email based on user's custom prompt
        const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "You are simulating a phishing email for an educational security test.\n" +
            "Write a highly convincing corporate email based on this exact prompt: \"" + prompt + "\".\n" +
            "You MUST include this exact placeholder string somewhere in the email where the user should click a link or button: \"{PORTAL_LINK}\".\n" +
            "Make the tone urgent or enticing, just like a real phishing email.\n" +
            "Format the output as a JSON object with two keys exactly: \"subject\" and \"htmlBody\".\n" +
            "The \"htmlBody\" should be beautifully formatted HTML with inline CSS. Do not use markdown syntax in your response, just return the raw JSON."
        });

        // Strip markdown backticks if Gemini accidentally includes them
        let jsonStr = aiResponse.text.trim();
        if (jsonStr.startsWith('\`\`\`json')) {
            jsonStr = jsonStr.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
        } else if (jsonStr.startsWith('\`\`\`')) {
            jsonStr = jsonStr.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
        }

        const generatedContent = JSON.parse(jsonStr);

        // Step 2: Loop through emails, swap out the placeholder with the real malicious link, and send
        emails.forEach(email => {
            db.run(
                'INSERT INTO campaigns (name, template, target_email) VALUES (?, ?, ?)',
                [name, 'Custom Gemini AI Prompt', email],
                function (err) {
                    processedCount++;
                    
                    if (err) {
                        console.error("Database error for email:", email, err.message);
                    } else {
                        const campaignId = this.lastID;
                        insertedCampaigns.push({ id: campaignId, name, template: 'Custom Gemini AI Prompt', target_email: email, status: 'sent' });

                        const portalLink = `http://localhost:5173/portal/${campaignId}/${encodeURIComponent(email)}`;
                        
                        // Inject the unique portal link into the AI generated HTML
                        const finalHtml = generatedContent.htmlBody.replace('{PORTAL_LINK}', portalLink);

                        const mailOptions = {
                            from: '"Security Team Simulator" <alerts@local-simulator.com>',
                            to: email,
                            subject: generatedContent.subject,
                            text: "Please view this email in an HTML compatible client.",
                            html: finalHtml
                        };

                        if(transporter) {
                             transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    console.error('Error sending mail:', error);
                                } else {
                                    console.log('Message sent: %s', info?.messageId || 'Real SMTP Email');
                                    if (info && info.messageId && info.messageId.includes('ethereal')) {
                                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                                    }
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
    } catch (aiError) {
        console.error("Gemini AI Error:", aiError);
        return res.status(500).json({ error: "Failed to generate AI email." });
    }
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
