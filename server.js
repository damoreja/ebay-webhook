const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// The secret token you will give to eBay.
const VERIFICATION_TOKEN = "my-secret-token-123";

// We will update this URL in a moment after Render gives it to us!
const ENDPOINT_URL = "https://ebay-webhook-rwxq.onrender.com/webhook"; 

app.get('/webhook', (req, res) => {
    const challengeCode = req.query.challenge_code;

    if (challengeCode) {
        const hash = crypto.createHash('sha256');
        hash.update(challengeCode);
        hash.update(VERIFICATION_TOKEN);
        hash.update(ENDPOINT_URL);
        const responseHash = hash.digest('hex');

        res.json({
            "challengeResponse": responseHash
        });
    } else {
        res.status(400).send("Missing challenge code");
    }
});

app.post('/webhook', (req, res) => {
    console.log("Received deletion request:", req.body);
    res.status(200).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
