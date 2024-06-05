const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { swapTonToToken } = require("./swapTonToToken");
const { swapTokenToTon } = require("./swapTokenToTon");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.post("/swap-ton-to-token", async (req, res) => {
    const { pairAddress, tonToken } = req.body;
    console.log(
        `Received swap request: pairAddress=${pairAddress}, tonToken=${tonToken}`
    );

    try {
        await swapTonToToken(pairAddress, tonToken);
        res.status(200).send("Swap successful");
    } catch (error) {
        console.error("Error swapping tokens:", error);
        res.status(500).send("Error swapping tokens: " + error.message);
    }
});

app.post("/swap-token-to-ton", async (req, res) => {
    const { importTokenAddress, importTokenAmount } = req.body;
    console.log(
        `Received swap request: importTokenAddress=${importTokenAddress}, importTokenAmount=${importTokenAmount}`
    );

    try {
        await swapTokenToTon(importTokenAddress, importTokenAmount);
        res.status(200).send("Swap successful");
    } catch (error) {
        console.error("Error swapping tokens:", error);
        res.status(500).send("Error swapping tokens: " + error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
