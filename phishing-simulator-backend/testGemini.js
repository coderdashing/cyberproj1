require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Hello"
        });
        console.log(response.text);
    } catch(e) {
        console.error(JSON.stringify(e, null, 2));
    }
}
test();
