
const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
require('dotenv').config();

const corsOptions = {
    origin: "http://localhost:5173"
};

app.use(cors(corsOptions));
app.use(express.json())

app.post(`/api/gemini`, async (req, res) => {

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
    console.errror("COULD NOT GET API KEY");
      return;
    }

    const systemInstructions = req.body.systemInstruction;
    const userPrompt = req.body.userPrompt;

    console.log('Attempting to request Gemini AI...');
    try {
        const response = axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            "system_instruction": {
                "parts": [
                    {
                        "text": systemInstructions
                    }
                ]
            },
            "contents": [
                {
                    "parts": [
                        {
                            "text": userPrompt
                        }
                    ]
                }
            ]
        }).then((response) => {
            res.send(response.data.candidates[0].content.parts[0].text);
        }).catch((err) => {
            console.log(err);
        });
    } catch (err) {
        console.log(err);
    }
})

app.listen(8080, () => {
    console.log(`Backend server started on port 8080`);
});